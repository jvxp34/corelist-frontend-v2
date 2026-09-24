import { useMemo, useState } from 'react'

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  History as HistoryIcon,
  Search,
  ShoppingCart,
  TrendingDown,
  X,
} from 'lucide-react'

function History() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todas')
  const [compraSelecionada, setCompraSelecionada] =
    useState<number | null>(null)

  const compras = [
    {
      id: 1,
      nome: 'Mercado da semana',
      data: '20/09/2026',
      itens: 12,
      valor: 142.8,
      economia: 18.4,
      estabelecimento: 'Mercado X',
    },
    {
      id: 2,
      nome: 'Compras de casa',
      data: '15/09/2026',
      itens: 18,
      valor: 320.4,
      economia: 21.6,
      estabelecimento: 'Supermercado Y',
    },
    {
      id: 3,
      nome: 'Churrasco',
      data: '07/09/2026',
      itens: 9,
      valor: 98.5,
      economia: 12.3,
      estabelecimento: 'Mercado X',
    },
    {
      id: 4,
      nome: 'Compras rápidas',
      data: '01/09/2026',
      itens: 6,
      valor: 81.2,
      economia: 5.5,
      estabelecimento: 'Mercadinho Central',
    },
  ]

  const comprasFiltradas = useMemo(() => {
    return compras.filter((compra) => {
      const termo = busca.toLowerCase().trim()

      const correspondeBusca =
        compra.nome.toLowerCase().includes(termo) ||
        compra.estabelecimento.toLowerCase().includes(termo)

      if (!correspondeBusca) {
        return false
      }

      if (filtro === 'Maior valor') {
        return compra.valor >= 150
      }

      if (filtro === 'Menor valor') {
        return compra.valor < 150
      }

      return true
    })
  }, [busca, filtro])

  const totalGasto = compras.reduce(
    (total, compra) => total + compra.valor,
    0,
  )

  const totalEconomizado = compras.reduce(
    (total, compra) => total + compra.economia,
    0,
  )

  const totalItens = compras.reduce(
    (total, compra) => total + compra.itens,
    0,
  )

  const mediaCompra =
    compras.length === 0
      ? 0
      : totalGasto / compras.length

  const compraDetalhes =
    compras.find(
      (compra) => compra.id === compraSelecionada,
    ) ?? null

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <HistoryIcon size={20} />
            </div>

            <span className="text-sm font-semibold text-blue-600">
              Suas compras
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            Histórico
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Consulte suas compras anteriores, valores e
            economias.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <CheckCircle2 size={18} />
          {compras.length} compras concluídas
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600">
            <ShoppingCart size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Compras realizadas
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {compras.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-fit rounded-xl bg-green-50 p-3 text-green-600">
            <CircleDollarSign size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Total gasto
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            R$ {totalGasto.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-fit rounded-xl bg-purple-50 p-3 text-purple-600">
            <ShoppingCart size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Itens comprados
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {totalItens}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="w-fit rounded-xl bg-orange-50 p-3 text-orange-600">
            <TrendingDown size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Economia
          </p>

          <p className="mt-1 text-3xl font-bold text-green-600">
            R$ {totalEconomizado.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
              placeholder="Pesquisar compra ou estabelecimento..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={filtro}
            onChange={(event) =>
              setFiltro(event.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            <option value="Todas">Todas as compras</option>
            <option value="Maior valor">
              Compras acima de R$ 150
            </option>
            <option value="Menor valor">
              Compras abaixo de R$ 150
            </option>
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Compras anteriores
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {comprasFiltradas.length}{' '}
              {comprasFiltradas.length === 1
                ? 'compra encontrada'
                : 'compras encontradas'}
            </p>
          </div>
        </div>

        {comprasFiltradas.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto w-fit rounded-full bg-gray-100 p-4 text-gray-500">
              <HistoryIcon size={32} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Nenhuma compra encontrada
            </h3>

            <p className="mt-2 text-gray-500">
              Tente pesquisar por outro nome ou altere o
              filtro.
            </p>

            {(busca !== '' || filtro !== 'Todas') && (
              <button
                type="button"
                onClick={() => {
                  setBusca('')
                  setFiltro('Todas')
                }}
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {comprasFiltradas.map((compra) => (
              <div
                key={compra.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="p-5">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <ShoppingCart size={22} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {compra.nome}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={15} />
                            {compra.data}
                          </span>

                          <span>
                            {compra.itens} itens
                          </span>

                          <span>
                            {compra.estabelecimento}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 md:justify-end">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-500">
                          Valor da compra
                        </p>

                        <p className="text-xl font-bold text-gray-900">
                          R$ {compra.valor.toFixed(2)}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600 md:justify-end">
                          <TrendingDown size={14} />
                          Economia de R${' '}
                          {compra.economia.toFixed(2)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCompraSelecionada(compra.id)
                        }
                        className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Detalhes
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2
                      size={17}
                      className="text-green-500"
                    />
                    Compra concluída
                  </div>

                  <span className="text-xs font-medium text-gray-400">
                    #{String(compra.id).padStart(4, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Média */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">
              Média por compra
            </p>

            <p className="mt-1 text-3xl font-bold">
              R$ {mediaCompra.toFixed(2)}
            </p>

            <p className="mt-1 text-sm text-blue-100">
              Baseado nas compras registradas no histórico.
            </p>
          </div>

          <div className="w-fit rounded-xl bg-white/10 p-4">
            <CircleDollarSign size={32} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {compraDetalhes && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setCompraSelecionada(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Detalhes da compra
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {compraDetalhes.nome}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCompraSelecionada(null)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Data
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {compraDetalhes.data}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Estabelecimento
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {compraDetalhes.estabelecimento}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Itens
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {compraDetalhes.itens}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Economia
                </p>

                <p className="mt-1 font-semibold text-green-600">
                  R$ {compraDetalhes.economia.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-blue-700">
                Valor total
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-700">
                R$ {compraDetalhes.valor.toFixed(2)}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCompraSelecionada(null)
              }
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Aviso */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm leading-6 text-blue-700">
          <strong>Dados demonstrativos:</strong> este
          histórico utiliza dados de exemplo enquanto a
          integração com as compras reais não estiver
          disponível.
        </p>
      </div>
    </div>
  )
}

export default History