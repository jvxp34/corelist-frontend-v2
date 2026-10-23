import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useUsuario } from '../hooks/useUsuario'
import FotoProduto from '../components/FotoProduto'
import { nomeDeExibicao } from '../services/auth'
import {
  listarListas,
  obterHistorico,
  obterPromocoes,
  obterResumoListas,
  type List,
  type ListSummaryCategory,
  type Promotion,
} from '../services/lists'
import {
  formatarData,
  formatarMoeda,
  situacaoDoOrcamento,
  textoDoSaldo,
} from '../utils/formatar'


function chaveDoMes(data: Date) {
  return `${data.getFullYear()}-${data.getMonth()}`
}


function nomeDoMes(data: Date) {
  return data.toLocaleDateString('pt-BR', {
    month: 'long',
  })
}


function maiuscula(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}


const CARD =
  'rounded-2xl border border-line bg-white p-6 sm:p-7'

const BOTAO_PRINCIPAL =
  'inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700'

const LINK =
  'text-sm font-semibold text-brand-600 hover:text-brand-800'


interface DadosInicio {
  listasAtivas: List[]
  historico: List[]
  categorias: ListSummaryCategory[]
  promocoes: Promotion[]
}


function Dashboard() {
  const usuario = useUsuario()
  const nome = nomeDeExibicao(usuario)

  const [dados, setDados] =
    useState<DadosInicio | null>(null)

  const [erro, setErro] = useState('')


  useEffect(() => {
    let cancelado = false

    // Cada bloco funciona sozinho: se uma chamada falhar, o resto aparece.
    Promise.allSettled([
      listarListas(),
      obterHistorico(),
      obterResumoListas(),
      obterPromocoes(),
    ]).then(([listas, historico, resumo, promocoes]) => {
      if (cancelado) {
        return
      }

      if (
        listas.status === 'rejected' &&
        historico.status === 'rejected'
      ) {
        setErro(
          'Não foi possível carregar seus dados. Tente entrar de novo.',
        )
      }

      setDados({
        listasAtivas:
          listas.status === 'fulfilled'
            ? listas.value
                .filter((lista) => !lista.is_completed)
                .sort((a, b) =>
                  b.updated_at.localeCompare(a.updated_at),
                )
            : [],
        historico:
          historico.status === 'fulfilled'
            ? [...historico.value].sort((a, b) =>
                (b.completed_at ?? '').localeCompare(
                  a.completed_at ?? '',
                ),
              )
            : [],
        categorias:
          resumo.status === 'fulfilled'
            ? resumo.value.categories
            : [],
        promocoes:
          promocoes.status === 'fulfilled'
            ? promocoes.value
            : [],
      })
    })

    return () => {
      cancelado = true
    }
  }, [])


  const hoje = new Date()

  const dataDeHoje = maiuscula(
    hoje.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
  )


  return (
    <div className="mx-auto max-w-5xl space-y-7">

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {dataDeHoje}
          </p>

          <h1 className="mt-1.5 font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]">
            Olá{nome ? `, ${nome}` : ''}! O que vamos comprar hoje?
          </h1>
        </div>

        <Link to="/listas?nova=1" className={BOTAO_PRINCIPAL}>
          + Nova lista
        </Link>
      </div>


      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {erro}
        </div>
      )}


      {!dados ? (
        <div className={`${CARD} text-center text-muted`}>
          Carregando seu resumo...
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-5">
          <CompraDeHoje lista={dados.listasAtivas[0]} />

          <ResumoDoMes
            historico={dados.historico}
            hoje={hoje}
          />

          <Categorias categorias={dados.categorias} />

          <MenorPreco promocoes={dados.promocoes} />

          <UltimasCompras historico={dados.historico} />
        </div>
      )}
    </div>
  )
}


function CompraDeHoje({ lista }: { lista?: List }) {
  if (!lista) {
    return (
      <section
        aria-label="Compra de hoje"
        className={`${CARD} flex flex-col items-start gap-4 lg:col-span-3`}
      >
        <div>
          <p className="text-[13px] font-semibold text-brand-600">
            Compra de hoje
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">
            Nenhuma compra em andamento
          </h2>
          <p className="mt-2 text-muted">
            Crie uma lista com o que você precisa comprar e
            defina um orçamento para acompanhar os gastos.
          </p>
        </div>

        <Link to="/listas?nova=1" className={BOTAO_PRINCIPAL}>
          Criar lista
        </Link>
      </section>
    )
  }

  const itens = lista.items ?? []
  const total = Number(lista.total ?? 0)
  const situacao = situacaoDoOrcamento(total, lista.budget)
  const temOrcamento = situacao.nivel !== 'sem'
  const faltam = itens.filter(
    (item) => !item.is_completed,
  ).length

  return (
    <section
      aria-label="Compra de hoje"
      className={`${CARD} flex flex-col gap-5 lg:col-span-3`}
    >
      <div>
        <p className="text-[13px] font-semibold text-brand-600">
          Compra de hoje
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold">
          {lista.name}
        </h2>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatarMoeda(total)}
          </p>

          {temOrcamento && (
            <p className="text-sm text-muted">
              de {formatarMoeda(situacao.orcamento)}
            </p>
          )}
        </div>

        {temOrcamento && (
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${situacao.corBarra}`}
              style={{
                width: `${Math.min(situacao.usado * 100, 100)}%`,
              }}
            />
          </div>
        )}

        <p className="mt-2.5 text-sm text-muted">
          {temOrcamento && (
            <>
              <span className={`font-semibold ${situacao.corTexto}`}>
                {textoDoSaldo(situacao)}
              </span>
              {' · '}
            </>
          )}
          {itens.length === 0
            ? 'nenhum produto ainda'
            : faltam === 0
              ? 'todos os produtos no carrinho'
              : `faltam ${faltam} de ${itens.length} produtos`}
        </p>
      </div>

      <Link
        to={`/listas/${lista.id}`}
        className={`${BOTAO_PRINCIPAL} self-start`}
      >
        Continuar compra
      </Link>
    </section>
  )
}


function ResumoDoMes({
  historico,
  hoje,
}: {
  historico: List[]
  hoje: Date
}) {
  const mesAtual = chaveDoMes(hoje)
  const dataMesAnterior = new Date(
    hoje.getFullYear(),
    hoje.getMonth() - 1,
    1,
  )
  const mesAnterior = chaveDoMes(dataMesAnterior)

  const doMes = (chave: string) =>
    historico.filter(
      (lista) =>
        lista.completed_at &&
        chaveDoMes(new Date(lista.completed_at)) === chave,
    )

  const somar = (listas: List[]) =>
    listas.reduce(
      (total, lista) => total + Number(lista.total ?? 0),
      0,
    )

  const comprasDoMes = doMes(mesAtual)
  const gastoDoMes = somar(comprasDoMes)
  const gastoAnterior = somar(doMes(mesAnterior))

  const comOrcamento = comprasDoMes.filter(
    (lista) => Number(lista.budget ?? 0) > 0,
  )
  const dentroDoOrcamento = comOrcamento.filter(
    (lista) =>
      Number(lista.total ?? 0) <= Number(lista.budget),
  ).length

  const variacao =
    gastoAnterior > 0
      ? Math.round(
          ((gastoDoMes - gastoAnterior) / gastoAnterior) * 100,
        )
      : null

  return (
    <section
      aria-label={`Resumo de ${nomeDoMes(hoje)}`}
      className={`${CARD} flex flex-col gap-2 lg:col-span-2`}
    >
      <p className="text-[13px] font-semibold text-muted">
        {maiuscula(nomeDoMes(hoje))} até agora
      </p>

      <p className="text-3xl font-semibold tabular-nums tracking-tight">
        {formatarMoeda(gastoDoMes)}
      </p>

      {variacao !== null && (
        <p
          className={`text-sm font-semibold ${
            variacao <= 0 ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {variacao === 0
            ? `Igual a ${nomeDoMes(dataMesAnterior)}`
            : `${Math.abs(variacao)}% a ${
                variacao < 0 ? 'menos' : 'mais'
              } que ${nomeDoMes(dataMesAnterior)}`}
        </p>
      )}

      <p className="mt-auto border-t border-slate-100 pt-4 text-sm leading-relaxed text-muted">
        {comprasDoMes.length === 0 ? (
          'Nenhuma compra concluída neste mês ainda.'
        ) : (
          <>
            {comprasDoMes.length}{' '}
            {comprasDoMes.length === 1 ? 'compra' : 'compras'}
            {' · '}média de{' '}
            {formatarMoeda(gastoDoMes / comprasDoMes.length)}
            {comOrcamento.length > 0 && (
              <>
                <br />
                {dentroDoOrcamento} de {comOrcamento.length}{' '}
                dentro do orçamento
              </>
            )}
          </>
        )}
      </p>
    </section>
  )
}


function Categorias({
  categorias,
}: {
  categorias: ListSummaryCategory[]
}) {
  const ordenadas = [...categorias]
    .map((categoria) => ({
      nome: categoria.category,
      total: Number(categoria.total),
    }))
    .sort((a, b) => b.total - a.total)

  // Três maiores categorias e o resto junto em "Outros".
  const principais = ordenadas.slice(0, 3)
  const outros = ordenadas
    .slice(3)
    .reduce((total, categoria) => total + categoria.total, 0)

  if (outros > 0) {
    principais.push({ nome: 'Outros', total: outros })
  }

  const soma = principais.reduce(
    (total, categoria) => total + categoria.total,
    0,
  )
  const maior = Math.max(
    ...principais.map((categoria) => categoria.total),
    1,
  )

  return (
    <section
      aria-label="Gastos por categoria"
      className={`${CARD} lg:col-span-3`}
    >
      <h2 className="text-[15px] font-semibold">
        Para onde vai seu dinheiro
      </h2>

      {principais.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Os gastos por categoria aparecem depois da primeira
          compra concluída.
        </p>
      ) : (
        <div className="mt-5 space-y-3.5">
          {principais.map((categoria) => (
            <div
              key={categoria.nome}
              className="grid grid-cols-[96px_minmax(0,1fr)_48px] items-center gap-3 text-sm sm:grid-cols-[120px_minmax(0,1fr)_56px]"
            >
              <span className="truncate text-slate-700">
                {categoria.nome}
              </span>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{
                    width: `${(categoria.total / maior) * 100}%`,
                  }}
                />
              </div>

              <span className="text-right font-semibold tabular-nums">
                {Math.round((categoria.total / soma) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}


function MenorPreco({
  promocoes,
}: {
  promocoes: Promotion[]
}) {
  const principais = promocoes
    .map((promocao) => {
      const media = Number(promocao.historical_average)
      const preco = Number(promocao.current_price)

      return {
        id: promocao.item_id,
        nome: promocao.product,
        foto: promocao.image_url,
        preco,
        desconto:
          media > 0
            ? Math.round(((media - preco) / media) * 100)
            : 0,
      }
    })
    .sort((a, b) => b.desconto - a.desconto)
    .slice(0, 3)

  return (
    <section
      aria-label="Produtos com menor preço"
      className={`${CARD} lg:col-span-2`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold">
          Produtos com menor preço
        </h2>

        <Link to="/promocoes" className={LINK}>
          Ver todos
        </Link>
      </div>

      {principais.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Quando um produto da sua lista estiver mais barato
          que a média que você pagou, ele aparece aqui.
        </p>
      ) : (
        <div className="mt-2">
          {principais.map((produto) => (
            <div
              key={produto.id}
              className="flex items-center gap-3 border-b border-slate-100 py-2 text-sm last:border-b-0"
            >
              <FotoProduto
                url={produto.foto}
                nome={produto.nome}
                tamanho="sm"
              />

              <span className="min-w-0 flex-1 truncate font-medium">
                {produto.nome}
              </span>

              <span className="shrink-0 tabular-nums">
                <strong>{formatarMoeda(produto.preco)}</strong>{' '}
                <span className="font-semibold text-green-700">
                  -{produto.desconto}%
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}


function UltimasCompras({
  historico,
}: {
  historico: List[]
}) {
  const ultimas = historico.slice(0, 3)

  return (
    <section
      aria-label="Últimas compras"
      className={`${CARD} lg:col-span-5`}
    >
      <h2 className="text-[15px] font-semibold">
        Últimas compras
      </h2>

      {ultimas.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Suas compras concluídas aparecem aqui.
        </p>
      ) : (
        <div className="mt-2">
          {ultimas.map((lista) => {
            const total = Number(lista.total ?? 0)
            const orcamento = Number(lista.budget ?? 0)
            const passou =
              orcamento > 0 && total > orcamento

            return (
              <Link
                key={lista.id}
                to={`/listas/${lista.id}`}
                className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-t border-slate-100 py-3 text-sm first:border-t-0 hover:text-brand-800"
              >
                <span className="text-muted">
                  {lista.completed_at
                    ? formatarData(lista.completed_at)
                    : ''}
                </span>

                <span className="min-w-0 truncate font-medium">
                  {lista.name}
                  {passou && (
                    <span className="font-medium text-red-700">
                      {' '}· passou do orçamento
                    </span>
                  )}
                </span>

                <span className="font-semibold tabular-nums">
                  {formatarMoeda(total)}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}


export default Dashboard
