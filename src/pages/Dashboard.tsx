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

function Dashboard() {
  const listasRecentes = [
    {
      id: 1,
      nome: 'Mercado da semana',
      produtos: 8,
      comprados: 5,
      valor: 142.8,
      cor: 'blue',
    },
    {
      id: 2,
      nome: 'Compras de casa',
      produtos: 15,
      comprados: 10,
      valor: 320.4,
      cor: 'purple',
    },
    {
      id: 3,
      nome: 'Churrasco',
      produtos: 6,
      comprados: 2,
      valor: 98.5,
      cor: 'orange',
    },
  ]

  const produtosRecentes = [
    {
      nome: 'Arroz',
      categoria: 'Alimentos',
      preco: 12.0,
      variacao: -5,
    },
    {
      nome: 'Café',
      categoria: 'Bebidas',
      preco: 18.9,
      variacao: -18,
    },
    {
      nome: 'Detergente',
      categoria: 'Limpeza',
      preco: 3.49,
      variacao: 4,
    },
    {
      nome: 'Leite',
      categoria: 'Alimentos',
      preco: 5.99,
      variacao: -2,
    },
  ]

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
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <Plus size={18} />
                Nova lista
              </button>

              <button
                type="button"
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
                Economia este mês
              </p>

              <p className="mt-1 text-2xl font-bold">
                R$ 47,80
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs text-blue-100">
                <TrendingDown size={13} />
                7,1% de economia
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs text-blue-100">
                Itens comprados
              </p>

              <p className="mt-1 text-2xl font-bold">
                34
              </p>

              <div className="mt-2 text-xs text-blue-100">
                76% das suas listas
              </div>
            </div>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <ShoppingCart size={21} />
              </div>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                +2
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Listas criadas
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              8
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
              R$ 642,90
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                <Package size={21} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                cadastrados
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Produtos
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              28
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                <CheckCircle2 size={21} />
              </div>

              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                76%
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Itens comprados
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              34
            </p>
          </div>
        </section>

        {/* PRÓXIMA COMPRA */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                <ShoppingCart size={25} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-blue-600">
                    Continue sua compra
                  </p>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                    Em andamento
                  </span>
                </div>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Mercado da semana
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  5 de 8 produtos já foram comprados.
                </p>
              </div>
            </div>

            <div className="min-w-0 lg:w-96">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">
                  Progresso
                </span>

                <span className="font-bold text-blue-600">
                  62%
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                  style={{ width: '62%' }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Valor estimado
                </p>

                <p className="font-bold text-slate-900">
                  R$ 142,80
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Continuar
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* LISTAS + ECONOMIA */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Suas listas
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Acompanhe suas compras recentes.
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Ver todas
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {listasRecentes.map((lista) => {
                const progresso =
                  lista.produtos === 0
                    ? 0
                    : Math.round(
                        (lista.comprados /
                          lista.produtos) *
                          100,
                      )

                const iconeClasses =
                  lista.cor === 'purple'
                    ? 'bg-violet-50 text-violet-600'
                    : lista.cor === 'orange'
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-blue-50 text-blue-600'

                return (
                  <div
                    key={lista.id}
                    className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-xl p-3 ${iconeClasses}`}
                      >
                        <ShoppingCart size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {lista.nome}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {lista.comprados} de{' '}
                              {lista.produtos} produtos
                            </p>
                          </div>

                          <p className="font-bold text-slate-900">
                            R$ {lista.valor.toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                              style={{
                                width: `${progresso}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-slate-500">
                            {progresso}%
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        size={18}
                        className="hidden text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600 sm:block"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                  <TrendingDown size={22} />
                </div>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  Este mês
                </span>
              </div>

              <p className="mt-8 text-sm text-emerald-50">
                Você economizou
              </p>

              <p className="mt-1 text-4xl font-bold">
                R$ 47,80
              </p>

              <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown size={17} />
                  <span className="font-semibold">
                    7,1% de economia
                  </span>
                </div>

                <p className="mt-2 text-sm leading-5 text-emerald-50">
                  Comparando seus preços, você conseguiu
                  gastar menos nas últimas compras.
                </p>
              </div>

              <button
                type="button"
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
                Informações que podem ajudar nas suas próximas
                compras.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-600">
                  Economia
                </span>

                <TrendingDown
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <h3 className="mt-4 font-bold text-emerald-900">
                Café em promoção
              </h3>

              <p className="mt-2 text-sm leading-5 text-emerald-700">
                O café está 18% mais barato no Mercado X.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-600">
                  Atenção
                </span>

                <TrendingUp
                  size={19}
                  className="text-amber-600"
                />
              </div>

              <h3 className="mt-4 font-bold text-amber-900">
                Arroz aumentou
              </h3>

              <p className="mt-2 text-sm leading-5 text-amber-700">
                O preço aumentou R$ 3,20 desde a última
                compra.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600">
                  Dica
                </span>

                <Lightbulb
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <h3 className="mt-4 font-bold text-blue-900">
                Revise sua lista
              </h3>

              <p className="mt-2 text-sm leading-5 text-blue-700">
                Sua lista está R$ 14 acima da média das últimas
                compras.
              </p>
            </div>
          </div>
        </section>

        {/* PRODUTOS */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Produtos acompanhados
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Veja como os preços estão variando.
              </p>
            </div>

            <button
              type="button"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              Ver produtos
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {produtosRecentes.map((produto) => (
              <div
                key={produto.nome}
                className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                    <Package size={18} />
                  </div>

                  {produto.variacao < 0 ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      <TrendingDown size={12} />
                      {Math.abs(produto.variacao)}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-500">
                      <TrendingUp size={12} />
                      {produto.variacao}%
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {produto.nome}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {produto.categoria}
                </p>

                <p className="mt-4 text-xl font-bold text-slate-900">
                  R$ {produto.preco.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
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