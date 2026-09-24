import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

function Reports() {
  const gastosMensais = [
    {
      mes: 'Abr',
      valor: 480,
    },
    {
      mes: 'Mai',
      valor: 560,
    },
    {
      mes: 'Jun',
      valor: 510,
    },
    {
      mes: 'Jul',
      valor: 690,
    },
    {
      mes: 'Ago',
      valor: 610,
    },
    {
      mes: 'Set',
      valor: 642,
    },
  ]

  const categorias = [
    {
      nome: 'Alimentos',
      valor: 286.4,
      percentual: 45,
    },
    {
      nome: 'Bebidas',
      valor: 128.6,
      percentual: 20,
    },
    {
      nome: 'Limpeza',
      valor: 96.4,
      percentual: 15,
    },
    {
      nome: 'Higiene',
      valor: 77.2,
      percentual: 12,
    },
    {
      nome: 'Outros',
      valor: 54.3,
      percentual: 8,
    },
  ]

  const maiorGasto = Math.max(
    ...gastosMensais.map((item) => item.valor),
  )

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <BarChart3 size={20} />
            </div>

            <span className="text-sm font-semibold text-blue-600">
              Visão financeira
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            Relatórios
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Acompanhe seus gastos, economia e evolução das
            suas compras.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <CalendarDays size={17} />
          Últimos 6 meses
        </button>
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CircleDollarSign size={21} />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
              <ArrowUp size={13} />
              5,2%
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Gastos no período
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            R$ 3.492,40
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Comparado ao período anterior
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <TrendingDown size={21} />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <ArrowDown size={13} />
              12,4%
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Economia
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            R$ 386,70
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Em relação aos preços anteriores
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
              <ShoppingCart size={21} />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <ArrowUp size={13} />
              8,1%
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Compras realizadas
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            24
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Nos últimos 6 meses
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <TrendingUp size={21} />
            </div>

            <div className="rounded-full bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-600">
              Média
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Gasto médio
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            R$ 145,52
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Por compra realizada
          </p>
        </div>
      </div>

      {/* Gráfico de gastos */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Evolução dos gastos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Veja como seus gastos variaram nos últimos meses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Gastos
          </div>
        </div>

        <div className="mt-8 flex h-64 items-end gap-3 sm:gap-6">
          {gastosMensais.map((item) => {
            const altura =
              (item.valor / maiorGasto) * 100

            return (
              <div
                key={item.mes}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div className="mb-2 text-center text-xs font-semibold text-gray-500">
                  R$ {item.valor}
                </div>

                <div className="relative flex h-full items-end">
                  <div
                    className="group relative w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-500 hover:from-blue-700 hover:to-cyan-500"
                    style={{
                      height: `${altura}%`,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow" />
                  </div>
                </div>

                <p className="mt-3 text-center text-xs font-medium text-gray-500">
                  {item.mes}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Categorias */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Gastos por categoria
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Onde seu dinheiro está sendo utilizado.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {categorias.map((categoria) => (
              <div key={categoria.nome}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    {categoria.nome}
                  </p>

                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">
                      R$ {categoria.valor.toFixed(2)}
                    </span>

                    <span className="ml-2 text-xs text-gray-400">
                      {categoria.percentual}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    style={{
                      width: `${categoria.percentual}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <TrendingDown size={22} />
          </div>

          <p className="mt-6 text-sm font-semibold text-cyan-300">
            Insight do período
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Você está gastando mais com alimentos.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Alimentos representam aproximadamente 45% dos
            seus gastos registrados. Comparar preços antes
            das próximas compras pode ajudar a reduzir esse
            valor.
          </p>

          <div className="mt-6 rounded-xl bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Participação nos gastos
              </span>

              <span className="text-lg font-bold text-white">
                45%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: '45%' }}
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-6 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Ver detalhes
          </button>
        </div>
      </div>

      {/* Aviso */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm leading-6 text-blue-700">
          <strong>Dados demonstrativos:</strong> os valores
          desta tela são exemplos visuais. Quando integrarmos
          os relatórios ao backend, eles serão calculados a
          partir das suas listas e compras reais.
        </p>
      </div>
    </div>
  )
}

export default Reports