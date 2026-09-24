import {
  ArrowRight,
  Clock3,
  Heart,
  MapPin,
  ShoppingCart,
  Sparkles,
  Tag,
  TrendingDown,
} from 'lucide-react'

function Promotions() {
  const ofertas = [
    {
      id: 1,
      produto: 'Café 500g',
      mercado: 'Mercado Central',
      precoAtual: 16.9,
      precoAnterior: 20.9,
      desconto: 19,
      validade: 'Até domingo',
    },
    {
      id: 2,
      produto: 'Arroz 5kg',
      mercado: 'Supermercado Bom Preço',
      precoAtual: 22.9,
      precoAnterior: 27.9,
      desconto: 18,
      validade: 'Até sábado',
    },
    {
      id: 3,
      produto: 'Leite 1L',
      mercado: 'Mercado Econômico',
      precoAtual: 4.79,
      precoAnterior: 5.99,
      desconto: 20,
      validade: 'Até sexta',
    },
    {
      id: 4,
      produto: 'Detergente',
      mercado: 'Supermercado Popular',
      precoAtual: 2.49,
      precoAnterior: 3.29,
      desconto: 24,
      validade: 'Até domingo',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-orange-50 p-2 text-orange-500">
              <Tag size={20} />
            </div>

            <span className="text-sm font-semibold text-orange-600">
              Ofertas para você
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            Promoções
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Encontre ofertas e acompanhe oportunidades para
            economizar nas suas compras.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Ver todas
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Destaque */}
      <div className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-cyan-300/10" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur-sm">
            <Sparkles size={16} />
            Oportunidade da semana
          </div>

          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            Economize nas compras que você já faz
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-blue-50">
            Compare preços, acompanhe descontos e descubra
            onde suas compras podem sair mais em conta.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <TrendingDown size={18} />

              <span className="text-sm font-medium">
                Até 24% de desconto
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <ShoppingCart size={18} />

              <span className="text-sm font-medium">
                4 ofertas encontradas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <TrendingDown size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Maior desconto
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                24%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Tag size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Ofertas disponíveis
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {ofertas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Ofertas recentes
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                Hoje
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ofertas */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Ofertas em destaque
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Algumas oportunidades encontradas.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {ofertas.map((oferta) => (
            <div
              key={oferta.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <span className="absolute right-4 top-4 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  -{oferta.desconto}%
                </span>

                <div className="flex h-28 items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
                    <ShoppingCart
                      size={34}
                      className="text-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute bottom-4 right-4 rounded-full bg-white p-2.5 text-gray-400 shadow-sm transition hover:text-red-500"
                  aria-label={`Favoritar ${oferta.produto}`}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {oferta.produto}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={15} />
                      {oferta.mercado}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">
                      R${' '}
                      {oferta.precoAnterior.toFixed(2)}
                    </p>

                    <p className="text-xl font-bold text-blue-600">
                      R$ {oferta.precoAtual.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock3 size={15} />
                    {oferta.validade}
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Ver oferta
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso */}
      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 rounded-lg bg-white p-2 text-blue-600 shadow-sm">
            <Sparkles size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-blue-900">
              Compare antes de comprar
            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Os preços exibidos nesta tela são
              demonstrativos por enquanto. Quando integrarmos
              as promoções ao backend, esses dados poderão ser
              carregados automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Promotions