import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obterPromocoes,
  type Promotion,
} from '../services/lists'
import {
  formatarMoeda,
  formatarQuantidade,
} from '../utils/formatar'
import FotoProduto from '../components/FotoProduto'
import CreditoOpenFoodFacts from '../components/CreditoOpenFoodFacts'


interface Oferta {
  id: number
  listaId: number
  listaNome: string
  produto: string
  marca: string
  embalagem: string
  foto: string
  origem: Promotion['data_source']
  quantidade: number
  precoAtual: number
  mediaHistorica: number
  economiaTotal: number
  desconto: number
}


// O backend manda decimais como número ou texto; aqui tudo vira número.
function paraOferta(promocao: Promotion): Oferta {
  const precoAtual = Number(promocao.current_price)
  const mediaHistorica = Number(promocao.historical_average)
  const quantidade = Number(promocao.quantity)
  const economiaUnitaria = Number(promocao.savings)

  return {
    id: promocao.item_id,
    listaId: promocao.list_id,
    listaNome: promocao.list_name,
    produto: promocao.product,
    marca: promocao.brand ?? '',
    embalagem: promocao.package_size ?? '',
    foto: promocao.image_url ?? '',
    origem: promocao.data_source,
    quantidade,
    precoAtual,
    mediaHistorica,
    economiaTotal: economiaUnitaria * quantidade,
    desconto:
      mediaHistorica > 0
        ? Math.round((economiaUnitaria / mediaHistorica) * 100)
        : 0,
  }
}


function Promotions() {
  const [ofertas, setOfertas] =
    useState<Oferta[] | null>(null)

  const [erro, setErro] = useState('')


  useEffect(() => {
    let cancelado = false

    obterPromocoes()
      .then((promocoes) => {
        if (!cancelado) {
          setOfertas(
            promocoes
              .map(paraOferta)
              .sort((a, b) => b.desconto - a.desconto),
          )
        }
      })
      .catch(() => {
        if (!cancelado) {
          setOfertas([])
          setErro('Não foi possível carregar os produtos.')
        }
      })

    return () => {
      cancelado = true
    }
  }, [])


  const lista = ofertas ?? []

  const economiaTotal = lista.reduce(
    (total, oferta) => total + oferta.economiaTotal,
    0,
  )

  const maior = lista[0]

  const quantidadeDeListas = new Set(
    lista.map((oferta) => oferta.listaId),
  ).size


  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/promocoes"
        className="text-sm font-semibold text-muted transition hover:text-ink"
      >
        ‹ Preços da cidade
      </Link>

      <h1 className="mt-2 font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Mais barato que a sua média
      </h1>

      <p className="mt-1 max-w-2xl text-muted">
        Produtos das suas listas em andamento que estão mais
        baratos do que a média que você pagou nas compras
        concluídas.
      </p>


      {erro && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {erro}
        </div>
      )}


      {ofertas === null ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-8 text-center text-muted">
          Carregando...
        </div>
      ) : lista.length === 0 ? (
        !erro && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-display text-lg font-semibold">
              Nenhum produto abaixo da sua média agora
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              Para aparecer aqui, o produto precisa ter preço numa
              lista em andamento e em pelo menos uma compra
              concluída. Quanto mais compras você concluir, melhor
              fica a comparação.
            </p>

            <Link
              to="/listas"
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white hover:bg-brand-700"
            >
              Ver minhas listas
            </Link>
          </div>
        )
      ) : (
        <>
          <section
            aria-label="Resumo"
            className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4"
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-50 px-5 py-4 text-brand-800">
              <div>
                <p className="text-[13px] font-semibold">
                  Você economiza
                </p>
                <p className="mt-1 text-[28px] font-semibold tabular-nums tracking-tight text-[#2e2a6b]">
                  {formatarMoeda(economiaTotal)}
                </p>
                <p className="text-[13px]">
                  comprando pelo preço de agora
                </p>
              </div>

              {/* No celular, os outros cards somem e o resumo fica aqui. */}
              <p className="text-right text-[13px] leading-5 sm:hidden">
                {lista.length}{' '}
                {lista.length === 1 ? 'produto' : 'produtos'}
                <br />
                em {quantidadeDeListas}{' '}
                {quantidadeDeListas === 1 ? 'lista' : 'listas'}
              </p>
            </div>

            <div className="hidden rounded-2xl border border-line bg-white px-5 py-4 sm:block">
              <p className="text-[13px] font-semibold text-muted">
                Maior desconto
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-tight">
                {maior.desconto}%
              </p>
              <p className="truncate text-[13px] text-muted">
                {maior.produto}
              </p>
            </div>

            <div className="hidden rounded-2xl border border-line bg-white px-5 py-4 sm:block">
              <p className="text-[13px] font-semibold text-muted">
                Produtos abaixo da média
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-tight">
                {lista.length}
              </p>
              <p className="text-[13px] text-muted">
                em {quantidadeDeListas}{' '}
                {quantidadeDeListas === 1 ? 'lista' : 'listas'}
              </p>
            </div>
          </section>


          <section
            aria-label="Produtos"
            className="mt-6 overflow-hidden rounded-2xl border border-line bg-white"
          >
            <h2 className="border-b border-slate-100 px-5 py-4 text-[15px] font-semibold">
              Do maior para o menor desconto
            </h2>

            <ul className="divide-y divide-slate-100">
              {lista.map((oferta) => (
                <li key={oferta.id}>
                  <Link
                    to={`/listas/${oferta.listaId}`}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-4 transition hover:bg-canvas sm:grid-cols-[auto_minmax(0,1fr)_200px_auto] sm:px-5"
                  >
                    <FotoProduto
                      url={oferta.foto}
                      nome={oferta.produto}
                      tamanho="md"
                    />

                    <div className="min-w-0">
                      {oferta.marca && (
                        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">
                          {oferta.marca}
                        </p>
                      )}
                      <p className="line-clamp-2 font-semibold leading-snug sm:truncate">
                        {oferta.produto}
                      </p>
                      <p className="truncate text-sm text-muted">
                        {[
                          oferta.embalagem,
                          `${formatarQuantidade(oferta.quantidade)} un. em ${oferta.listaNome}`,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>

                    {/* Barra: preço de agora em relação à média (risco = média). */}
                    <div
                      className="col-span-3 sm:col-span-1"
                      aria-hidden="true"
                    >
                      <div className="relative h-2 rounded-full bg-slate-100">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-green-600"
                          style={{
                            width: `${Math.min(
                              (oferta.precoAtual / oferta.mediaHistorica) * 100,
                              100,
                            )}%`,
                          }}
                        />
                        <div className="absolute -top-1 right-0 h-4 w-0.5 rounded bg-slate-400" />
                      </div>
                      <div className="mt-1.5 flex justify-between text-xs tabular-nums text-muted">
                        <span>agora {formatarMoeda(oferta.precoAtual)}</span>
                        <span>média {formatarMoeda(oferta.mediaHistorica)}</span>
                      </div>
                    </div>

                    <div className="col-start-3 row-start-1 text-right sm:col-start-auto sm:row-start-auto">
                      <p className="font-semibold tabular-nums">
                        {formatarMoeda(oferta.precoAtual)}
                      </p>
                      <p className="text-sm font-semibold text-green-700">
                        -{oferta.desconto}%
                      </p>
                      <p className="text-xs text-muted">
                        economia de {formatarMoeda(oferta.economiaTotal)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-4 text-sm leading-6 text-muted">
            A média considera só os preços que você registrou em
            compras concluídas. Quanto mais compras você concluir,
            mais precisa fica a comparação.
          </p>

          <div className="mt-2">
            <CreditoOpenFoodFacts
              origens={lista.map((oferta) => oferta.origem)}
            />
          </div>
        </>
      )}
    </div>
  )
}


export default Promotions
