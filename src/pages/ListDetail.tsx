import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

import {
  listarListas,
  listarItensDaLista,
  adicionarItemNaLista,
  atualizarItemDaLista,
  removerItemDaLista,
  concluirLista,
  atualizarLista,
  excluirLista,
  type List,
  type ListItem,
} from '../services/lists'
import {
  listarProdutos,
  type Product,
} from '../services/products'
import {
  formatarData,
  formatarMoeda,
  formatarQuantidade,
  situacaoDoOrcamento,
  textoDoSaldo,
} from '../utils/formatar'


const BOTAO_PRINCIPAL =
  'inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-100 disabled:text-brand-800/60'

const BOTAO_SECUNDARIO =
  'inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60'

const CAMPO =
  'mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'

const ROTULO = 'text-sm font-semibold text-slate-700'


function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const listId = Number(id)

  const [lista, setLista] =
    useState<List | null>(null)

  const [produtos, setProdutos] =
    useState<Product[]>([])

  const [itens, setItens] =
    useState<ListItem[]>([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] = useState('')

  // Lista concluída só aceita mudanças depois de "Editar lista".
  const [editandoLista, setEditandoLista] =
    useState(false)

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [produtoSelecionado, setProdutoSelecionado] =
    useState('')

  const [quantidade, setQuantidade] =
    useState('1')

  const [preco, setPreco] = useState('')

  const [salvando, setSalvando] =
    useState(false)

  const [concluindo, setConcluindo] =
    useState(false)

  const [itemEditando, setItemEditando] =
    useState<number | null>(null)

  const [quantidadeEdicao, setQuantidadeEdicao] =
    useState('')

  const [precoEdicao, setPrecoEdicao] =
    useState('')

  const [salvandoItem, setSalvandoItem] =
    useState(false)

  // Painel de nome, orçamento e exclusão (só listas em andamento).
  const [editandoDados, setEditandoDados] =
    useState(false)

  const [nomeEdicao, setNomeEdicao] = useState('')

  const [orcamentoEdicao, setOrcamentoEdicao] =
    useState('')

  const [salvandoDados, setSalvandoDados] =
    useState(false)


  useEffect(() => {
    if (Number.isNaN(listId)) {
      return
    }

    let cancelado = false

    Promise.all([
      listarListas(),
      listarProdutos(),
      listarItensDaLista(listId),
    ])
      .then(([listas, produtosData, itensData]) => {
        if (cancelado) {
          return
        }

        setLista(
          listas.find((item) => item.id === listId) ??
            null,
        )
        setProdutos(produtosData)
        setItens(itensData)
      })
      .catch(() => {
        if (!cancelado) {
          setErro(
            'Não foi possível carregar os dados da lista.',
          )
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCarregando(false)
        }
      })

    return () => {
      cancelado = true
    }
  }, [listId])


  function substituirItem(itemAtualizado: ListItem) {
    setItens((itensAtuais) =>
      itensAtuais.map((itemAtual) =>
        itemAtual.id === itemAtualizado.id
          ? itemAtualizado
          : itemAtual,
      ),
    )
  }


  function fecharFormulario() {
    setMostrarFormulario(false)
    setProdutoSelecionado('')
    setQuantidade('1')
    setPreco('')
  }


  async function adicionarProduto(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const novaQuantidade = Number(quantidade)

    if (!produtoSelecionado) {
      setErro('Escolha um produto.')
      return
    }

    if (!(novaQuantidade > 0)) {
      setErro('Informe uma quantidade maior que zero.')
      return
    }

    if (preco !== '' && !(Number(preco) >= 0)) {
      setErro('Informe um preço válido ou deixe vazio.')
      return
    }

    try {
      setSalvando(true)
      setErro('')

      const novoItem = await adicionarItemNaLista(
        listId,
        {
          product: Number(produtoSelecionado),
          quantity: novaQuantidade,
          price: preco === '' ? null : Number(preco),
        },
      )

      setItens((itensAtuais) => [
        ...itensAtuais,
        novoItem,
      ])

      fecharFormulario()
    } catch {
      setErro(
        'Não foi possível adicionar o produto à lista.',
      )
    } finally {
      setSalvando(false)
    }
  }


  async function alternarProduto(item: ListItem) {
    try {
      setErro('')

      substituirItem(
        await atualizarItemDaLista(listId, item.id, {
          is_completed: !item.is_completed,
        }),
      )
    } catch {
      setErro(
        'Não foi possível atualizar o produto.',
      )
    }
  }


  function iniciarEdicaoItem(item: ListItem) {
    setItemEditando(item.id)
    setQuantidadeEdicao(String(Number(item.quantity)))
    setPrecoEdicao(
      item.price === null
        ? ''
        : String(Number(item.price)),
    )
    setErro('')
  }


  function cancelarEdicaoItem() {
    setItemEditando(null)
    setQuantidadeEdicao('')
    setPrecoEdicao('')
  }


  async function salvarEdicaoItem(item: ListItem) {
    const novaQuantidade = Number(quantidadeEdicao)

    if (
      quantidadeEdicao === '' ||
      !(novaQuantidade > 0)
    ) {
      setErro('Informe uma quantidade maior que zero.')
      return
    }

    const novoPreco =
      precoEdicao === '' ? null : Number(precoEdicao)

    if (novoPreco !== null && !(novoPreco >= 0)) {
      setErro('Informe um preço válido ou deixe vazio.')
      return
    }

    try {
      setSalvandoItem(true)
      setErro('')

      substituirItem(
        await atualizarItemDaLista(listId, item.id, {
          quantity: novaQuantidade,
          price: novoPreco,
        }),
      )

      cancelarEdicaoItem()
    } catch {
      setErro(
        'Não foi possível salvar as alterações do produto.',
      )
    } finally {
      setSalvandoItem(false)
    }
  }


  async function removerProduto(item: ListItem) {
    try {
      setSalvandoItem(true)
      setErro('')

      await removerItemDaLista(listId, item.id)

      setItens((itensAtuais) =>
        itensAtuais.filter(
          (itemAtual) => itemAtual.id !== item.id,
        ),
      )

      cancelarEdicaoItem()
    } catch {
      setErro(
        'Não foi possível remover o produto da lista.',
      )
    } finally {
      setSalvandoItem(false)
    }
  }


  function abrirEdicaoDados(atual: List) {
    setNomeEdicao(atual.name)
    setOrcamentoEdicao(
      atual.budget === null || Number(atual.budget) === 0
        ? ''
        : String(Number(atual.budget)),
    )
    setEditandoDados(true)
    setMostrarFormulario(false)
    setErro('')
  }


  async function salvarDados(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (nomeEdicao.trim() === '') {
      setErro('Dê um nome para a lista.')
      return
    }

    const novoOrcamento =
      orcamentoEdicao === '' ? null : Number(orcamentoEdicao)

    if (novoOrcamento !== null && !(novoOrcamento >= 0)) {
      setErro('Informe um orçamento válido ou deixe vazio.')
      return
    }

    try {
      setSalvandoDados(true)
      setErro('')

      const atualizada = await atualizarLista(listId, {
        name: nomeEdicao.trim(),
        budget: novoOrcamento,
      })

      setLista(atualizada)
      setEditandoDados(false)
    } catch {
      setErro('Não foi possível salvar as alterações da lista.')
    } finally {
      setSalvandoDados(false)
    }
  }


  async function excluir(atual: List) {
    if (
      !window.confirm(
        `Excluir a lista "${atual.name}" e todos os produtos dela? Não dá para desfazer.`,
      )
    ) {
      return
    }

    try {
      setSalvandoDados(true)
      setErro('')

      await excluirLista(listId)

      navigate('/listas')
    } catch {
      setErro('Não foi possível excluir a lista.')
      setSalvandoDados(false)
    }
  }


  async function finalizarCompra() {
    if (itens.length === 0) {
      setErro(
        'Adicione pelo menos um produto antes de concluir a compra.',
      )
      return
    }

    if (faltam.length > 0) {
      setErro(
        'Marque todos os produtos como comprados antes de concluir.',
      )
      return
    }

    if (
      !window.confirm(
        'Concluir esta compra? Ela vai para o histórico com o total gasto.',
      )
    ) {
      return
    }

    try {
      setConcluindo(true)
      setErro('')

      await concluirLista(listId)

      navigate('/listas')
    } catch {
      setErro('Não foi possível concluir a compra.')
      setConcluindo(false)
    }
  }


  function finalizarEdicao() {
    if (itens.length === 0 || faltam.length > 0) {
      setErro(
        'Uma compra concluída precisa ter todos os produtos marcados.',
      )
      return
    }

    setEditandoLista(false)
    fecharFormulario()
    cancelarEdicaoItem()
    setErro('')
  }


  if (carregando) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center text-muted">
        Carregando lista...
      </div>
    )
  }


  if (!lista) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold">
          Lista não encontrada
        </h1>

        <p className="mt-2 text-muted">
          {erro ||
            'A lista que você tentou acessar não existe.'}
        </p>

        <Link
          to="/listas"
          className={`${BOTAO_SECUNDARIO} mt-5`}
        >
          Voltar para minhas listas
        </Link>
      </div>
    )
  }


  const podeEditar =
    !lista.is_completed || editandoLista

  const faltam = itens.filter(
    (item) => !item.is_completed,
  )

  const noCarrinho = itens.filter(
    (item) => item.is_completed,
  )

  const total = itens.reduce(
    (soma, item) => soma + Number(item.subtotal ?? 0),
    0,
  )

  const semPreco = itens.filter(
    (item) => item.price === null,
  ).length

  const situacao = situacaoDoOrcamento(
    total,
    lista.budget,
  )


  function nomeDoProduto(item: ListItem) {
    return (
      produtos.find(
        (produto) => produto.id === item.product,
      )?.name ?? `Produto #${item.product}`
    )
  }


  function renderizarItem(item: ListItem) {
    const nome = nomeDoProduto(item)
    const qtd = formatarQuantidade(item.quantity)

    if (itemEditando === item.id) {
      return (
        <li
          key={item.id}
          className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4"
        >
          <p className="font-semibold">{nome}</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className={ROTULO}>
              Quantidade
              <input
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={quantidadeEdicao}
                onChange={(event) =>
                  setQuantidadeEdicao(event.target.value)
                }
                className={CAMPO}
              />
            </label>

            <label className={ROTULO}>
              Preço por unidade (R$)
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={precoEdicao}
                onChange={(event) =>
                  setPrecoEdicao(event.target.value)
                }
                placeholder="Ex: 12.90"
                autoFocus
                className={CAMPO}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => salvarEdicaoItem(item)}
              disabled={salvandoItem}
              className={BOTAO_PRINCIPAL}
            >
              {salvandoItem ? 'Salvando...' : 'Salvar'}
            </button>

            <button
              type="button"
              onClick={cancelarEdicaoItem}
              disabled={salvandoItem}
              className={BOTAO_SECUNDARIO}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => removerProduto(item)}
              disabled={salvandoItem}
              className="ml-auto h-11 rounded-xl px-3 text-[15px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Remover
            </button>
          </div>
        </li>
      )
    }

    const valor =
      item.price === null
        ? podeEditar
          ? '+ Preço'
          : 'Sem preço'
        : formatarMoeda(Number(item.subtotal ?? 0))

    const corValor =
      item.price === null
        ? 'bg-amber-50 text-amber-800'
        : item.is_completed
          ? 'bg-transparent text-muted'
          : 'bg-canvas text-ink'

    return (
      <li
        key={item.id}
        className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2 sm:px-4"
      >
        <label className="flex min-h-12 min-w-0 flex-1 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={item.is_completed}
            onChange={() => alternarProduto(item)}
            disabled={!podeEditar || concluindo}
            className="h-6 w-6 shrink-0 accent-brand-600"
          />

          <span className="min-w-0">
            <span
              className={`block truncate text-base font-semibold ${
                item.is_completed
                  ? 'text-slate-400 line-through'
                  : 'text-ink'
              }`}
            >
              {nome}
            </span>

            <span className="block text-sm text-muted">
              {item.price === null
                ? `${qtd} un.`
                : `${qtd} × ${formatarMoeda(Number(item.price))}`}
            </span>
          </span>
        </label>

        {podeEditar ? (
          <button
            type="button"
            onClick={() => iniciarEdicaoItem(item)}
            disabled={concluindo || itemEditando !== null}
            aria-label={`Editar quantidade e preço de ${nome}`}
            className={`min-h-11 shrink-0 rounded-xl px-3 text-[15px] font-semibold tabular-nums transition hover:ring-1 hover:ring-brand-100 disabled:cursor-not-allowed ${corValor}`}
          >
            {valor}
          </button>
        ) : (
          <span
            className={`shrink-0 px-3 text-[15px] font-semibold tabular-nums ${
              item.price === null
                ? 'text-amber-800'
                : 'text-muted'
            }`}
          >
            {valor}
          </span>
        )}
      </li>
    )
  }


  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/listas"
        className="-ml-1 inline-flex h-10 items-center gap-1 rounded-lg pr-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ChevronLeft size={18} aria-hidden="true" />
        Minhas listas
      </Link>

      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">
            {lista.name}
          </h1>

          <p className="mt-1 text-sm text-muted">
            {lista.is_completed
              ? `Compra concluída${
                  lista.completed_at
                    ? ` em ${formatarData(lista.completed_at)}`
                    : ''
                }${editandoLista ? ' · editando' : ''}`
              : 'Em andamento'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!lista.is_completed && !editandoDados && (
            <button
              type="button"
              onClick={() => abrirEdicaoDados(lista)}
              disabled={concluindo}
              className={BOTAO_SECUNDARIO}
            >
              Editar
            </button>
          )}

          {lista.is_completed && !editandoLista && (
            <button
              type="button"
              onClick={() => {
                setEditandoLista(true)
                setErro('')
              }}
              className={BOTAO_SECUNDARIO}
            >
              Editar lista
            </button>
          )}

          {podeEditar && !mostrarFormulario && (
            <button
              type="button"
              onClick={() => setMostrarFormulario(true)}
              disabled={concluindo}
              className={BOTAO_PRINCIPAL}
            >
              + Adicionar produto
            </button>
          )}
        </div>
      </div>


      {editandoDados && !lista.is_completed && (
        <form
          onSubmit={salvarDados}
          className="mt-5 rounded-2xl border border-line bg-white p-5"
        >
          <h2 className="font-display text-lg font-semibold">
            Editar lista
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={ROTULO}>
              Nome da lista
              <input
                type="text"
                value={nomeEdicao}
                onChange={(event) =>
                  setNomeEdicao(event.target.value)
                }
                autoFocus
                className={CAMPO}
              />
            </label>

            <label className={ROTULO}>
              Orçamento (R$){' '}
              <span className="font-normal text-muted">
                vazio = sem orçamento
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={orcamentoEdicao}
                onChange={(event) =>
                  setOrcamentoEdicao(event.target.value)
                }
                placeholder="Ex: 250"
                className={CAMPO}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={salvandoDados}
              className={BOTAO_PRINCIPAL}
            >
              {salvandoDados ? 'Salvando...' : 'Salvar'}
            </button>

            <button
              type="button"
              onClick={() => setEditandoDados(false)}
              disabled={salvandoDados}
              className={BOTAO_SECUNDARIO}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => excluir(lista)}
              disabled={salvandoDados}
              className="ml-auto h-11 rounded-xl px-3 text-[15px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Excluir lista
            </button>
          </div>
        </form>
      )}


      {/* Resumo: fica preso no topo enquanto o usuário rola a lista. */}
      <section
        aria-label="Resumo da compra"
        className="sticky top-[57px] z-20 -mx-4 mt-5 border-y border-line bg-white px-4 py-4 sm:mx-0 sm:rounded-2xl sm:border md:top-4 sm:px-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[28px] font-semibold tabular-nums tracking-tight">
            {formatarMoeda(total)}
          </p>

          <p className="text-sm text-muted">
            {situacao.nivel === 'sem'
              ? 'Sem orçamento definido'
              : `de ${formatarMoeda(situacao.orcamento)}`}
          </p>
        </div>

        {situacao.nivel !== 'sem' && (
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${situacao.corBarra}`}
              style={{
                width: `${Math.min(situacao.usado * 100, 100)}%`,
              }}
            />
          </div>
        )}

        <p
          aria-live="polite"
          className="mt-2 text-sm text-muted"
        >
          {situacao.nivel !== 'sem' && (
            <>
              <span className={`font-semibold ${situacao.corTexto}`}>
                {textoDoSaldo(situacao)}
              </span>
              {' · '}
            </>
          )}
          {noCarrinho.length} de {itens.length} no carrinho
        </p>

        {semPreco > 0 && (
          <p className="mt-1 text-xs font-medium text-amber-800">
            {semPreco === 1
              ? '1 produto sem preço: o total pode estar incompleto.'
              : `${semPreco} produtos sem preço: o total pode estar incompleto.`}
          </p>
        )}
      </section>


      {erro && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {erro}
        </div>
      )}


      {mostrarFormulario && podeEditar && (
        <form
          onSubmit={adicionarProduto}
          className="mt-5 rounded-2xl border border-line bg-white p-5"
        >
          <h2 className="font-display text-lg font-semibold">
            Adicionar produto
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className={ROTULO}>
              Produto
              <select
                value={produtoSelecionado}
                onChange={(event) =>
                  setProdutoSelecionado(event.target.value)
                }
                autoFocus
                className={CAMPO}
              >
                <option value="">
                  Escolha um produto
                </option>

                {produtos.map((produto) => (
                  <option
                    key={produto.id}
                    value={produto.id}
                  >
                    {produto.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={ROTULO}>
              Quantidade
              <input
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={quantidade}
                onChange={(event) =>
                  setQuantidade(event.target.value)
                }
                className={CAMPO}
              />
            </label>

            <label className={ROTULO}>
              Preço (R$){' '}
              <span className="font-normal text-muted">
                opcional
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={preco}
                onChange={(event) =>
                  setPreco(event.target.value)
                }
                placeholder="Ex: 12.90"
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
              {salvando ? 'Adicionando...' : 'Adicionar'}
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


      {itens.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-display text-lg font-semibold">
            Nenhum produto ainda
          </p>

          <p className="mt-1 text-sm text-muted">
            Adicione o que você precisa comprar.
          </p>
        </div>
      ) : (
        <>
          {faltam.length > 0 && (
            <section
              aria-label="Falta pegar"
              className="mt-6"
            >
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Falta pegar · {faltam.length}
              </h2>

              <ul className="space-y-2">
                {faltam.map(renderizarItem)}
              </ul>
            </section>
          )}

          {noCarrinho.length > 0 && (
            <section
              aria-label="No carrinho"
              className="mt-6"
            >
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
                No carrinho · {noCarrinho.length}
              </h2>

              <ul className="space-y-2">
                {noCarrinho.map(renderizarItem)}
              </ul>
            </section>
          )}
        </>
      )}


      {/* Ação final: presa acima do menu inferior no celular. */}
      {(!lista.is_completed || editandoLista) && (
        <div className="sticky bottom-[84px] z-20 mt-6 rounded-2xl border border-line bg-white p-4 shadow-lg shadow-slate-900/5 md:bottom-6">
          {lista.is_completed ? (
            <button
              type="button"
              onClick={finalizarEdicao}
              disabled={
                itens.length === 0 || faltam.length > 0
              }
              className={`${BOTAO_PRINCIPAL} w-full`}
            >
              Finalizar edição
            </button>
          ) : (
            <button
              type="button"
              onClick={finalizarCompra}
              disabled={
                concluindo ||
                itens.length === 0 ||
                faltam.length > 0
              }
              className={`${BOTAO_PRINCIPAL} w-full`}
            >
              {concluindo ? 'Concluindo...' : 'Concluir compra'}
            </button>
          )}

          {itens.length > 0 && faltam.length > 0 && (
            <p className="mt-2 text-center text-sm text-muted">
              {faltam.length === 1
                ? 'Marque o produto que falta para concluir'
                : `Marque os ${faltam.length} produtos que faltam para concluir`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}


export default ListDetail
