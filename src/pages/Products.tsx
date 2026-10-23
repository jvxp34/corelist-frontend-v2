import { useEffect, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'

import {
  listarProdutos,
  criarProduto,
  removerProduto,
  type Product,
} from '../services/products'
import {
  listarCategorias,
  type Category,
} from '../services/categories'
import { formatarMoeda } from '../utils/formatar'


const BOTAO_PRINCIPAL =
  'inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const BOTAO_SECUNDARIO =
  'inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas'

const CAMPO =
  'mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'

const ROTULO = 'text-sm font-semibold text-slate-700'

const SEM_CATEGORIA = 'Sem categoria'


function Products() {
  const [produtos, setProdutos] =
    useState<Product[] | null>(null)

  const [categorias, setCategorias] =
    useState<Category[]>([])

  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [preco, setPreco] = useState('')
  const [unidade, setUnidade] = useState('')
  const [salvando, setSalvando] = useState(false)


  useEffect(() => {
    let cancelado = false

    Promise.all([listarProdutos(), listarCategorias()])
      .then(([produtosData, categoriasData]) => {
        if (!cancelado) {
          setProdutos(produtosData)
          setCategorias(categoriasData)
        }
      })
      .catch(() => {
        if (!cancelado) {
          setProdutos([])
          setErro('Não foi possível carregar os produtos.')
        }
      })

    return () => {
      cancelado = true
    }
  }, [])


  function fecharFormulario() {
    setMostrarFormulario(false)
    setNome('')
    setCategoria('')
    setPreco('')
    setUnidade('')
  }


  async function adicionarProduto(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (nome.trim() === '') {
      setErro('Informe o nome do produto.')
      return
    }

    if (preco !== '' && !(Number(preco) >= 0)) {
      setErro('Informe um preço válido ou deixe vazio.')
      return
    }

    try {
      setSalvando(true)
      setErro('')

      const novo = await criarProduto({
        name: nome.trim(),
        description: '',
        price: preco === '' ? null : Number(preco),
        unit: unidade.trim(),
        category: categoria === '' ? null : Number(categoria),
      })

      setProdutos((atuais) => [...(atuais ?? []), novo])
      fecharFormulario()
    } catch {
      setErro('Não foi possível cadastrar o produto.')
    } finally {
      setSalvando(false)
    }
  }


  async function remover(produto: Product) {
    if (
      !window.confirm(
        `Remover "${produto.name}" do catálogo?`,
      )
    ) {
      return
    }

    try {
      setErro('')

      await removerProduto(produto.id)

      setProdutos((atuais) =>
        (atuais ?? []).filter(
          (item) => item.id !== produto.id,
        ),
      )
    } catch {
      // O backend protege produtos que já estão em alguma lista.
      setErro(
        `Não foi possível remover "${produto.name}". Se ele já está em alguma lista, ele precisa continuar no catálogo.`,
      )
    }
  }


  function nomeDaCategoria(id: number | null) {
    return (
      categorias.find((item) => item.id === id)?.name ??
      SEM_CATEGORIA
    )
  }


  const termo = busca.trim().toLowerCase()

  const filtrados = (produtos ?? [])
    .filter((produto) =>
      produto.name.toLowerCase().includes(termo),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  // Agrupa por categoria, com "Sem categoria" no fim.
  const grupos = new Map<string, Product[]>()

  for (const produto of filtrados) {
    const nomeGrupo = nomeDaCategoria(produto.category)
    grupos.set(nomeGrupo, [
      ...(grupos.get(nomeGrupo) ?? []),
      produto,
    ])
  }

  const gruposOrdenados = [...grupos.entries()].sort(
    ([a], [b]) =>
      a === SEM_CATEGORIA
        ? 1
        : b === SEM_CATEGORIA
          ? -1
          : a.localeCompare(b, 'pt-BR'),
  )


  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
            Produtos
          </h1>

          <p className="mt-1 text-muted">
            O catálogo de produtos que você pode colocar nas
            listas.
          </p>
        </div>

        {!mostrarFormulario && (
          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className={BOTAO_PRINCIPAL}
          >
            + Novo produto
          </button>
        )}
      </div>


      {erro && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {erro}
        </div>
      )}


      {mostrarFormulario && (
        <form
          onSubmit={adicionarProduto}
          className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold">
            Novo produto
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={ROTULO}>
              Nome
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex: Arroz 5kg"
                autoFocus
                className={CAMPO}
              />
            </label>

            <label className={ROTULO}>
              Categoria{' '}
              <span className="font-normal text-muted">opcional</span>
              <select
                value={categoria}
                onChange={(event) =>
                  setCategoria(event.target.value)
                }
                className={CAMPO}
              >
                <option value="">Sem categoria</option>
                {categorias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={ROTULO}>
              Preço de referência (R$){' '}
              <span className="font-normal text-muted">opcional</span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={preco}
                onChange={(event) => setPreco(event.target.value)}
                placeholder="Ex: 24.90"
                className={CAMPO}
              />
            </label>

            <label className={ROTULO}>
              Unidade{' '}
              <span className="font-normal text-muted">opcional</span>
              <input
                type="text"
                value={unidade}
                onChange={(event) =>
                  setUnidade(event.target.value)
                }
                placeholder="Ex: kg, pacote, un."
                className={CAMPO}
              />
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={salvando}
              className={BOTAO_PRINCIPAL}
            >
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>

            <button
              type="button"
              onClick={fecharFormulario}
              className={BOTAO_SECUNDARIO}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}


      <label className="relative mt-6 block">
        <span className="sr-only">Buscar produto</span>
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar produto"
          className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
      </label>


      {produtos === null ? (
        <div className="mt-5 rounded-2xl border border-line bg-white p-8 text-center text-muted">
          Carregando produtos...
        </div>
      ) : filtrados.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-display text-lg font-semibold">
            {termo
              ? `Nenhum produto com "${busca.trim()}"`
              : 'Nenhum produto cadastrado'}
          </p>
          <p className="mt-1 text-sm text-muted">
            Cadastre um produto para usar nas suas listas.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {gruposOrdenados.map(([nomeGrupo, itens]) => (
            <section key={nomeGrupo} aria-label={nomeGrupo}>
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
                {nomeGrupo} · {itens.length}
              </h2>

              <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-line bg-white">
                {itens.map((produto) => (
                  <li
                    key={produto.id}
                    className="flex items-center gap-3 py-2 pl-4 pr-2 sm:pl-5"
                  >
                    <div className="min-w-0 flex-1 py-1">
                      <p className="truncate font-semibold">
                        {produto.name}
                      </p>
                      {produto.unit && (
                        <p className="text-sm text-muted">
                          {produto.unit}
                        </p>
                      )}
                    </div>

                    {produto.price !== null && (
                      <p
                        className="shrink-0 text-sm tabular-nums text-muted"
                        title="Preço de referência"
                      >
                        {formatarMoeda(Number(produto.price))}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => remover(produto)}
                      aria-label={`Remover ${produto.name}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}


export default Products
