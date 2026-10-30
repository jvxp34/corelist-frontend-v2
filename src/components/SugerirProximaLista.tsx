import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ListPlus } from 'lucide-react'

import FotoProduto from './FotoProduto'
import {
  listarItensDaLista,
  repetirCompra,
  type ListItem,
} from '../services/lists'
import { listarProdutos, type Product } from '../services/products'
import { formatarMoeda, formatarQuantidade } from '../utils/formatar'


// Depois de salvar uma compra pela nota fiscal: oferece criar a próxima
// lista com os mesmos produtos. O preço pago vira o preço planejado.
function SugerirProximaLista({ compraId }: { compraId: number }) {
  const navigate = useNavigate()

  const [itens, setItens] = useState<ListItem[] | null>(null)
  const [produtos, setProdutos] = useState<Product[]>([])
  const [marcados, setMarcados] = useState<Set<number>>(new Set())
  const [nome, setNome] = useState('Próxima compra')
  const [criando, setCriando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([listarItensDaLista(compraId), listarProdutos()])
      .then(([daCompra, catalogo]) => {
        const comprados = daCompra.filter((item) => item.is_completed)
        setItens(comprados)
        setProdutos(catalogo)
        setMarcados(new Set(comprados.map((item) => item.id)))
      })
      // Sem os itens não há o que sugerir: segue para a compra salva.
      .catch(() => navigate(`/listas/${compraId}`, { replace: true }))
  }, [compraId, navigate])

  useEffect(() => {
    if (itens !== null && itens.length === 0) {
      navigate(`/listas/${compraId}`, { replace: true })
    }
  }, [itens, compraId, navigate])

  function alternar(id: number) {
    setMarcados((atuais) => {
      const novos = new Set(atuais)
      if (novos.has(id)) novos.delete(id)
      else novos.add(id)
      return novos
    })
  }

  async function criar() {
    if (marcados.size === 0) {
      setErro('Marque ao menos um produto.')
      return
    }
    try {
      setCriando(true)
      setErro('')
      const nova = await repetirCompra(compraId, {
        nome: nome.trim(),
        itens: [...marcados],
      })
      navigate(`/listas/${nova.id}`)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível criar a lista.')
      setCriando(false)
    }
  }

  if (itens === null || itens.length === 0) {
    return <p className="mt-6 text-center text-muted">Compra salva. Carregando...</p>
  }

  const todosMarcados = marcados.size === itens.length

  return (
    <section aria-labelledby="titulo-proxima-lista" className="mt-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
        <Check size={16} aria-hidden="true" className="mr-1.5 inline" />
        Compra salva no histórico.
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <ListPlus size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 id="titulo-proxima-lista" className="font-display text-xl font-semibold">
              Criar a próxima lista com estes produtos?
            </h2>
            <p className="mt-1 text-sm text-muted">
              O preço que você pagou vira o preço planejado. Desmarque o que não precisa
              comprar de novo.
            </p>
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold" htmlFor="nome-proxima-lista">
          Nome da lista
        </label>
        <input
          id="nome-proxima-lista"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          maxLength={200}
          className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">
            {marcados.size} de {itens.length} produtos
          </span>
          <button
            type="button"
            onClick={() =>
              setMarcados(todosMarcados ? new Set() : new Set(itens.map((item) => item.id)))
            }
            className="font-semibold text-brand-600 hover:text-brand-800"
          >
            {todosMarcados ? 'Desmarcar todos' : 'Marcar todos'}
          </button>
        </div>

        <ul className="mt-2 divide-y divide-slate-100 border-y border-slate-100">
          {itens.map((item) => {
            const produto = produtos.find((p) => p.id === item.product)
            const nomeDoProduto = produto?.name ?? `Produto #${item.product}`
            const marcado = marcados.has(item.id)
            return (
              <li key={item.id}>
                <label className="flex cursor-pointer items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => alternar(item.id)}
                    className="h-5 w-5 shrink-0 accent-brand-600"
                  />
                  <FotoProduto url={produto?.image_url ?? ''} nome={nomeDoProduto} tamanho="sm" />
                  <span className={`min-w-0 flex-1 ${marcado ? '' : 'text-muted line-through'}`}>
                    <span className="block truncate text-[15px] font-semibold">{nomeDoProduto}</span>
                    <span className="text-xs text-muted">
                      {formatarQuantidade(item.quantity)} {item.measure === 'kg' ? 'kg' : 'un.'}
                      {item.price !== null &&
                        ` · ${formatarMoeda(Number(item.price))}${item.measure === 'kg' ? '/kg' : ''}`}
                    </span>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        {erro && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(`/listas/${compraId}`)}
            disabled={criando}
            className="h-11 rounded-xl border border-line px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas disabled:opacity-60"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={criar}
            disabled={criando || marcados.size === 0}
            className="h-11 rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {criando ? 'Criando...' : 'Criar lista'}
          </button>
        </div>
      </div>
    </section>
  )
}


export default SugerirProximaLista
