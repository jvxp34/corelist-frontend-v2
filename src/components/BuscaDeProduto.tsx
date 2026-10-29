import { useEffect, useState } from 'react'
import { Plus, ScanBarcode, Search, X } from 'lucide-react'

import LeitorDeCodigo from './LeitorDeCodigo'
import {
  buscarPorCodigoDeBarras,
  buscarProdutosParaLista,
  criarProduto,
  type Product,
  type ProdutoEncontrado,
} from '../services/products'
import { formatarMoeda } from '../utils/formatar'


interface Props {
  escolhido: ProdutoEncontrado | null
  aoEscolher: (produto: ProdutoEncontrado | null) => void
  // Avisa quando um produto novo entra no catálogo.
  aoCriar?: (produto: Product) => void
}


function deProduto(produto: Product): ProdutoEncontrado {
  return {
    id: produto.id,
    name: produto.name,
    brand: produto.brand,
    embalagem: (produto.package_size || produto.unit || '').trim(),
    ultimo_preco: null,
    ultima_medida: null,
    vezes: 0,
  }
}

function detalhes(produto: ProdutoEncontrado) {
  return [produto.brand, produto.embalagem].filter(Boolean).join(' · ')
}


// Campo para escolher o produto: busca enquanto digita, atalhos do que a
// pessoa mais compra, criar produto novo e ler código de barras.
function BuscaDeProduto({ escolhido, aoEscolher, aoCriar }: Props) {
  const [texto, setTexto] = useState('')
  const [resultados, setResultados] = useState<ProdutoEncontrado[]>([])
  const [frequentes, setFrequentes] = useState<ProdutoEncontrado[]>([])
  const [buscando, setBuscando] = useState(false)
  const [criando, setCriando] = useState(false)
  const [cameraAberta, setCameraAberta] = useState(false)
  const [aviso, setAviso] = useState('')

  // Os que a pessoa mais compra, para o atalho.
  useEffect(() => {
    const controle = new AbortController()
    buscarProdutosParaLista('', controle.signal)
      .then(setFrequentes)
      .catch(() => {})
    return () => controle.abort()
  }, [])

  // Busca enquanto digita, esperando a pessoa parar um instante.
  useEffect(() => {
    const termo = texto.trim()
    if (termo === '') {
      return
    }
    const controle = new AbortController()
    const espera = setTimeout(() => {
      setBuscando(true)
      buscarProdutosParaLista(termo, controle.signal)
        .then(setResultados)
        .catch(() => {})
        .finally(() => setBuscando(false))
    }, 250)
    return () => {
      clearTimeout(espera)
      controle.abort()
    }
  }, [texto])


  async function criarNovo() {
    const nome = texto.trim()
    if (nome === '') {
      return
    }
    try {
      setCriando(true)
      setAviso('')
      const novo = await criarProduto({
        name: nome,
        description: '',
        price: null,
        unit: '',
        category: null,
      })
      aoCriar?.(novo)
      aoEscolher(deProduto(novo))
      setTexto('')
    } catch (falha) {
      setAviso(falha instanceof Error ? falha.message : 'Não foi possível criar o produto.')
    } finally {
      setCriando(false)
    }
  }


  async function lerCodigo(codigo: string) {
    setCameraAberta(false)
    setAviso('')
    try {
      const resultado = await buscarPorCodigoDeBarras(codigo)
      if (resultado.origem === 'catalogo') {
        aoEscolher(deProduto(resultado.produto))
        return
      }
      const sugestao = resultado.sugestao
      const novo = await criarProduto({
        name: sugestao.name,
        description: '',
        price: null,
        unit: '',
        category: null,
        brand: sugestao.brand,
        package_size: sugestao.package_size,
        barcode: sugestao.barcode || codigo,
        image_url: sugestao.image_url,
        data_source: sugestao.data_source,
      })
      aoCriar?.(novo)
      aoEscolher(deProduto(novo))
    } catch {
      setAviso('Não achamos esse código de barras. Digite o nome do produto.')
    }
  }


  if (escolhido) {
    return (
      <div className="mt-1.5 flex min-h-11 items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">{escolhido.name}</p>
          {detalhes(escolhido) && (
            <p className="truncate text-sm text-muted">{detalhes(escolhido)}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => aoEscolher(null)}
          aria-label="Trocar produto"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-white hover:text-ink"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    )
  }

  const termo = texto.trim()
  const lista = termo === '' ? [] : resultados
  const temIgual = lista.some(
    (produto) => produto.name.toLowerCase() === termo.toLowerCase(),
  )

  return (
    <div className="mt-1.5">
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={texto}
            onChange={(evento) => {
              setTexto(evento.target.value)
              setAviso('')
            }}
            placeholder="Buscar produto (ex.: arroz)"
            autoComplete="off"
            autoFocus
            aria-label="Buscar produto"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          type="button"
          onClick={() => setCameraAberta(true)}
          aria-label="Ler código de barras"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-800 transition hover:bg-brand-100"
        >
          <ScanBarcode size={20} aria-hidden="true" />
        </button>
      </div>

      {termo !== '' && (
        <ul
          aria-label="Produtos encontrados"
          className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-line bg-white"
        >
          {lista.map((produto) => (
            <li key={produto.id}>
              <button
                type="button"
                onClick={() => {
                  aoEscolher(produto)
                  setTexto('')
                }}
                className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-2.5 text-left transition hover:bg-canvas"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium text-ink">
                    {produto.name}
                  </span>
                  {detalhes(produto) && (
                    <span className="block truncate text-sm text-muted">{detalhes(produto)}</span>
                  )}
                </span>
                {produto.ultimo_preco && (
                  <span className="shrink-0 text-sm tabular-nums text-muted">
                    último: {formatarMoeda(Number(produto.ultimo_preco))}
                  </span>
                )}
              </button>
            </li>
          ))}

          {lista.length === 0 && (
            <li className="px-3.5 py-2.5 text-sm text-muted">
              {buscando ? 'Buscando...' : 'Nenhum produto encontrado.'}
            </li>
          )}

          {!temIgual && (
            <li>
              <button
                type="button"
                onClick={criarNovo}
                disabled={criando}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[15px] font-semibold text-brand-600 transition hover:bg-brand-50 disabled:opacity-60"
              >
                <Plus size={18} aria-hidden="true" />
                {criando ? 'Criando...' : `Adicionar "${termo}" como produto novo`}
              </button>
            </li>
          )}
        </ul>
      )}

      {termo === '' && frequentes.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Você costuma comprar
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {frequentes.map((produto) => (
              <button
                key={produto.id}
                type="button"
                onClick={() => aoEscolher(produto)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-brand-100 hover:bg-brand-50"
              >
                {produto.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {aviso && (
        <p role="status" className="mt-2 text-sm font-medium text-amber-800">
          {aviso}
        </p>
      )}

      {cameraAberta && (
        <LeitorDeCodigo
          tipo="barras"
          titulo="Ler código de barras"
          dica="Aponte para o código de barras da embalagem."
          aoFechar={() => setCameraAberta(false)}
          aoLer={lerCodigo}
        />
      )}
    </div>
  )
}


export default BuscaDeProduto
