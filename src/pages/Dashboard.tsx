import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Lightbulb,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import {
  obterInsights,
  obterResumoListas,
  type ListInsight,
  type ListSummary,
} from '../services/lists'

function Dashboard() {
  const navigate = useNavigate()

  const [resumo, setResumo] =
    useState<ListSummary | null>(null)

  const [insights, setInsights] =
    useState<ListInsight[]>([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setCarregando(true)
        setErro('')

        const [resumoData, insightsData] =
          await Promise.all([
            obterResumoListas(),
            obterInsights(),
          ])

        setResumo(resumoData)
        setInsights(insightsData)
      } catch (error) {
        console.error(error)

        setErro(
          'Não foi possível carregar os dados do Dashboard.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDashboard()
  }, [])

  const totalGasto = Number(
    resumo?.total ?? 0,
  )

  const listasConcluidas =
    resumo?.lists_count ?? 0

  const mediaCompra = Number(
    resumo?.average_purchase ?? 0,
  )

  const categorias =
    resumo?.categories.length ?? 0

  const variacaoPeriodo = Number(
    resumo?.period_comparison
      .percentage_change ?? 0,
  )

  const periodoAtual =
    resumo?.period_comparison.current_month || ''

  const periodoAnterior =
    resumo?.period_comparison.previous_month || ''

  const topProdutos =
    resumo?.top_products.slice(0, 4) ?? []

  function obterEstiloInsight(
    severity: ListInsight['severity'],
  ) {
    if (severity === 'critical') {
      return {
        container:
          'border-red-100 bg-red-50',
        badge:
          'bg-white text-red-600',
        icon:
          'text-red-600',
        title:
          'text-red-900',
        message:
          'text-red-700',
      }
    }

    if (severity === 'warning') {
      return {
        container:
          'border-amber-100 bg-amber-50',
        badge:
          'bg-white text-amber-600',
        icon:
          'text-amber-600',
        title:
          'text-amber-900',
        message:
          'text-amber-700',
      }
    }

    return {
      container:
        'border-blue-100 bg-blue-50',
      badge:
        'bg-white text-blue-600',
      icon:
        'text-blue-600',
      title:
        'text-blue-900',
      message:
        'text-blue-700',
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-cyan-300/10" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles size={15} />

              Seu resumo de compras
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Olá, João 👋
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
              Organize suas compras, acompanhe seus gastos e
              encontre oportunidades para economizar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/listas')}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <Plus size={18} />

                Nova lista
              </button>

              <button
                type="button"
                onClick={() => navigate('/historico')}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ShoppingCart size={18} />

                Minhas compras
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:w-80">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs text-blue-100">
                Média por compra
              </p>

              <p className="mt-1 text-2xl font-bold">
                R$ {mediaCompra.toFixed(2)}
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs text-blue-100">
                <CircleDollarSign size={13} />

                média calculada pelo histórico
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs text-blue-100">
                Listas concluídas
              </p>

              <p className="mt-1 text-2xl font-bold">
                {listasConcluidas}
              </p>

              <div className="mt-2 text-xs text-blue-100">
                compras registradas
              </div>
            </div>
          </div>
        </section>

        {/* STATUS */}
        {erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {carregando && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
            Atualizando seus dados...
          </div>
        )}

        {/* INDICADORES */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <ShoppingCart size={21} />
              </div>

              <CheckCircle2
                size={18}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Listas concluídas
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {listasConcluidas}
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <CircleDollarSign size={21} />
              </div>

              <TrendingDown
                size={18}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Total em compras
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              R$ {totalGasto.toFixed(2)}
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                <Package size={21} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                histórico
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Média por compra
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              R$ {mediaCompra.toFixed(2)}
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                <CheckCircle2 size={21} />
              </div>

              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                {categorias}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Categorias utilizadas
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {categorias}
            </p>
          </div>
        </section>

        {/* COMPARAÇÃO */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                <TrendingDown size={25} />
              </div>

              <div>
                <p className="text-sm font-medium text-blue-600">
                  Comparação de gastos
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Evolução das suas compras
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {periodoAnterior && periodoAtual
                    ? `${periodoAnterior} → ${periodoAtual}`
                    : 'Ainda não há períodos suficientes para comparação.'}
                </p>
              </div>
            </div>

            <div className="min-w-0 lg:w-96">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">
                  Variação
                </span>

                <span
                  className={`font-bold ${
                    variacaoPeriodo <= 0
                      ? 'text-emerald-600'
                      : 'text-red-500'
                  }`}
                >
                  {variacaoPeriodo >= 0 ? '+' : ''}
                  {variacaoPeriodo.toFixed(1)}%
                </span>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  {variacaoPeriodo <= 0 ? (
                    <TrendingDown
                      size={20}
                      className="text-emerald-500"
                    />
                  ) : (
                    <TrendingUp
                      size={20}
                      className="text-red-500"
                    />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {variacaoPeriodo <= 0
                        ? 'Gastos menores no período'
                        : 'Gastos maiores no período'}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Comparação calculada pelo histórico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUTOS MAIS COMPRADOS */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Produtos mais comprados
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Veja quais produtos aparecem com mais frequência
                no seu histórico.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/produtos')}
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              Ver produtos

              <ArrowRight size={16} />
            </button>
          </div>

          {topProdutos.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
              <Package
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 text-sm text-slate-500">
                Ainda não existem produtos registrados no
                histórico.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {topProdutos.map((produto, index) => (
                <div
                  key={produto.product}
                  className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Package size={18} />
                    </div>

                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                      #{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {produto.product}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Produto mais comprado
                  </p>

                  <p className="mt-4 text-xl font-bold text-slate-900">
                    {Number(produto.quantity).toLocaleString(
                      'pt-BR',
                    )}
                  </p>

                  <p className="text-xs text-slate-500">
                    unidades compradas
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RESUMO */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Resumo das listas
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Acompanhe suas compras registradas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/listas')}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Ver todas

                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm text-blue-700">
                  Total gasto
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-900">
                  R$ {totalGasto.toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-5">
                <p className="text-sm text-emerald-700">
                  Média por compra
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-900">
                  R$ {mediaCompra.toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl bg-violet-50 p-5">
                <p className="text-sm text-violet-700">
                  Listas concluídas
                </p>

                <p className="mt-2 text-2xl font-bold text-violet-900">
                  {listasConcluidas}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-5">
                <p className="text-sm text-orange-700">
                  Categorias
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-900">
                  {categorias}
                </p>
              </div>
            </div>
          </section>

          {/* VARIAÇÃO */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                  {variacaoPeriodo <= 0 ? (
                    <TrendingDown size={22} />
                  ) : (
                    <TrendingUp size={22} />
                  )}
                </div>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  Período
                </span>
              </div>

              <p className="mt-8 text-sm text-emerald-50">
                Variação dos gastos
              </p>

              <p className="mt-1 text-4xl font-bold">
                {variacaoPeriodo >= 0 ? '+' : ''}
                {variacaoPeriodo.toFixed(1)}%
              </p>

              <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  {variacaoPeriodo <= 0 ? (
                    <TrendingDown size={17} />
                  ) : (
                    <TrendingUp size={17} />
                  )}

                  <span className="font-semibold">
                    {variacaoPeriodo <= 0
                      ? 'Redução nos gastos'
                      : 'Aumento nos gastos'}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-5 text-emerald-50">
                  {periodoAnterior && periodoAtual
                    ? `Comparação entre ${periodoAnterior} e ${periodoAtual}.`
                    : 'O histórico ainda não possui dados suficientes para comparação.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/relatorios')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                Ver relatório

                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </div>

        {/* OPORTUNIDADES */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Lightbulb size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Oportunidades para você
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Insights gerados com base nos seus dados.
              </p>
            </div>
          </div>

          {insights.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
              <Lightbulb
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-medium text-slate-700">
                Ainda não há insights disponíveis.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Continue registrando suas compras para que o
                CoreList possa analisar seu histórico.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {insights.map((insight, index) => {
                const estilo =
                  obterEstiloInsight(
                    insight.severity,
                  )

                return (
                  <div
                    key={`${insight.type}-${index}`}
                    className={`rounded-2xl border p-5 ${estilo.container}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}
                      >
                        {insight.type}
                      </span>

                      <Lightbulb
                        size={19}
                        className={estilo.icon}
                      />
                    </div>

                    <h3
                      className={`mt-4 font-bold ${estilo.title}`}
                    >
                      {insight.title}
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-5 ${estilo.message}`}
                    >
                      {insight.message}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles size={18} />

                <span className="text-sm font-semibold">
                  CoreList
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold">
                Pronto para organizar sua próxima compra?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Crie uma lista, adicione seus produtos e tenha
                tudo organizado antes de sair de casa.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/listas')}
              className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              <Plus size={18} />

              Criar nova lista
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard