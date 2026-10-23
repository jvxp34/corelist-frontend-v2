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


interface Oferta {
  id: number
  listaId: number
  listaNome: string
  produto: string
  quantidade: number
  precoAtual: number
  mediaHistorica: number
  economiaUnitaria: number
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
    quantidade,
    precoAtual,
    mediaHistorica,
    economiaUnitaria,
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


  const economiaTotal = (ofertas ?? []).reduce(
    (total, oferta) => total + oferta.economiaTotal,
    0,
  )


  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Produtos com menor preço
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
      ) : ofertas.length === 0 ? (
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
          <div className="mt-6 rounded-2xl bg-brand-50 px-5 py-4 text-brand-800">
            <p className="text-[15px]">
              Comprando esses {ofertas.length}{' '}
              {ofertas.length === 1 ? 'produto' : 'produtos'} pelo
              preço de agora, você economiza{' '}
              <strong className="tabular-nums">
                {formatarMoeda(economiaTotal)}
              </strong>{' '}
              em relação à sua média.
            </p>
          </div>

          <ul className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-line bg-white">
            {ofertas.map((oferta) => (
              <li key={oferta.id}>
                <Link
                  to={`/listas/${oferta.listaId}`}
                  className="flex items-center gap-4 px-4 py-4 transition hover:bg-canvas sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {oferta.produto}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-muted">
                      Sua média {formatarMoeda(oferta.mediaHistorica)}
                      {' · '}
                      {formatarQuantidade(oferta.quantidade)} un. em{' '}
                      {oferta.listaNome}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums">
                      {formatarMoeda(oferta.precoAtual)}
                    </p>

                    <p className="text-sm font-semibold text-green-700">
                      -{oferta.desconto}% · economia de{' '}
                      {formatarMoeda(oferta.economiaTotal)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}


export default Promotions
