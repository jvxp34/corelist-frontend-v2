import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  listarListas,
  criarLista,
  type List,
} from '../services/lists'
import {
  formatarData,
  formatarMoeda,
  situacaoDoOrcamento,
  textoDoSaldo,
} from '../utils/formatar'


type Aba = 'andamento' | 'concluidas'


const BOTAO_PRINCIPAL =
  'inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const BOTAO_SECUNDARIO =
  'inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas'

const CAMPO =
  'mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'


function Lists() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // /listas?nova=1 (botão "+ Nova lista" do Início) já abre o formulário.
  const [mostrarFormulario, setMostrarFormulario] =
    useState(searchParams.get('nova') === '1')

  const [nomeLista, setNomeLista] = useState('')
  const [orcamento, setOrcamento] = useState('')

  const [listas, setListas] =
    useState<List[] | null>(null)

  const [aba, setAba] =
    useState<Aba>('andamento')

  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')


  useEffect(() => {
    let cancelado = false

    listarListas()
      .then((dados) => {
        if (!cancelado) {
          setListas(dados)
        }
      })
      .catch(() => {
        if (!cancelado) {
          setListas([])
          setErro('Não foi possível carregar suas listas.')
        }
      })

    return () => {
      cancelado = true
    }
  }, [])


  function fecharFormulario() {
    setMostrarFormulario(false)
    setNomeLista('')
    setOrcamento('')
  }


  async function criarNovaLista(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (nomeLista.trim() === '') {
      setErro('Dê um nome para a lista.')
      return
    }

    const valorOrcamento =
      orcamento === '' ? null : Number(orcamento)

    if (
      valorOrcamento !== null &&
      (Number.isNaN(valorOrcamento) || valorOrcamento < 0)
    ) {
      setErro('Informe um orçamento válido ou deixe vazio.')
      return
    }

    try {
      setSalvando(true)
      setErro('')

      const novaLista = await criarLista({
        name: nomeLista.trim(),
        budget: valorOrcamento,
      })

      // Lista nova vai direto para a tela de adicionar produtos.
      navigate(`/listas/${novaLista.id}`)
    } catch {
      setErro('Não foi possível criar a lista.')
      setSalvando(false)
    }
  }


  const emAndamento = (listas ?? [])
    .filter((lista) => !lista.is_completed)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))

  const concluidas = (listas ?? [])
    .filter((lista) => lista.is_completed)
    .sort((a, b) =>
      (b.completed_at ?? '').localeCompare(a.completed_at ?? ''),
    )

  const visiveis =
    aba === 'andamento' ? emAndamento : concluidas


  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
            Minhas listas
          </h1>

          <p className="mt-1 text-muted">
            Crie listas, defina um orçamento e acompanhe na hora
            da compra.
          </p>
        </div>

        {!mostrarFormulario && (
          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className={BOTAO_PRINCIPAL}
          >
            + Nova lista
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
          onSubmit={criarNovaLista}
          className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold">
            Nova lista
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Nome da lista
              <input
                type="text"
                value={nomeLista}
                onChange={(event) =>
                  setNomeLista(event.target.value)
                }
                placeholder="Ex: Compra da semana"
                autoFocus
                className={CAMPO}
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Orçamento (R$){' '}
              <span className="font-normal text-muted">
                opcional
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={orcamento}
                onChange={(event) =>
                  setOrcamento(event.target.value)
                }
                placeholder="Ex: 250"
                className={CAMPO}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={salvando}
              className={BOTAO_PRINCIPAL}
            >
              {salvando ? 'Criando...' : 'Criar lista'}
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


      <div
        role="group"
        aria-label="Filtrar listas"
        className="mt-6 flex gap-2"
      >
        <AbaBotao
          ativa={aba === 'andamento'}
          onClick={() => setAba('andamento')}
        >
          Em andamento · {emAndamento.length}
        </AbaBotao>

        <AbaBotao
          ativa={aba === 'concluidas'}
          onClick={() => setAba('concluidas')}
        >
          Concluídas · {concluidas.length}
        </AbaBotao>
      </div>


      {listas === null ? (
        <div className="mt-5 rounded-2xl border border-line bg-white p-8 text-center text-muted">
          Carregando suas listas...
        </div>
      ) : visiveis.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-display text-lg font-semibold">
            {aba === 'andamento'
              ? 'Nenhuma lista em andamento'
              : 'Nenhuma compra concluída ainda'}
          </p>

          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            {aba === 'andamento'
              ? 'Crie uma lista com o que você precisa comprar.'
              : 'Quando você concluir uma compra, ela aparece aqui com o total gasto.'}
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {visiveis.map((lista) => (
            <CartaoLista key={lista.id} lista={lista} />
          ))}
        </div>
      )}
    </div>
  )
}


function AbaBotao({
  ativa,
  onClick,
  children,
}: {
  ativa: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativa}
      className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
        ativa
          ? 'bg-ink text-white'
          : 'border border-line bg-white text-slate-700 hover:bg-canvas'
      }`}
    >
      {children}
    </button>
  )
}


function CartaoLista({ lista }: { lista: List }) {
  const itens = lista.items ?? []
  const total = Number(lista.total ?? 0)
  const noCarrinho = itens.filter(
    (item) => item.is_completed,
  ).length
  const situacao = situacaoDoOrcamento(total, lista.budget)

  const detalhe = lista.is_completed
    ? `${itens.length} produtos · concluída em ${
        lista.completed_at
          ? formatarData(lista.completed_at)
          : ''
      }`
    : itens.length === 0
      ? 'Nenhum produto ainda'
      : `${itens.length} produtos · ${noCarrinho} no carrinho`

  return (
    <Link
      to={`/listas/${lista.id}`}
      className="block rounded-2xl border border-line bg-white p-5 transition hover:border-brand-100 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">
            {lista.name}
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            {detalhe}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${situacao.corChip}`}
        >
          {situacao.rotulo}
        </span>
      </div>

      {situacao.nivel !== 'sem' && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${situacao.corBarra}`}
            style={{
              width: `${Math.min(situacao.usado * 100, 100)}%`,
            }}
          />
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap justify-between gap-x-3 text-sm">
        <span className="tabular-nums text-muted">
          {situacao.nivel === 'sem'
            ? formatarMoeda(total)
            : `${formatarMoeda(total)} de ${formatarMoeda(situacao.orcamento)}`}
        </span>

        {situacao.nivel !== 'sem' && (
          <span className={`font-semibold ${situacao.corTexto}`}>
            {textoDoSaldo(situacao)}
          </span>
        )}
      </div>
    </Link>
  )
}


export default Lists
