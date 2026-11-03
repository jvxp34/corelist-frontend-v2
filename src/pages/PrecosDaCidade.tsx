import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, MapPin, Navigation, Search, X } from 'lucide-react'

import AdicionarFoto from '../components/AdicionarFoto'
import FotoProduto from '../components/FotoProduto'
import LogoDaLoja from '../components/LogoDaLoja'
import OndeEstou from '../components/OndeEstou'
import { useLocalizacao } from '../hooks/useLocalizacao'
import {
  buscarPrecos,
  linkComoChegar,
  nomeDaLojaParaMostrar,
  textoDistancia,
  type LojaDoPreco,
  type Periodo,
  type PrecoNaLoja,
  type Raio,
  type ResumoDePreco,
} from '../services/precos'
import { formatarMoeda, quandoFoi } from '../utils/formatar'


const PERIODOS: Periodo[] = [7, 30, 90]
const RAIOS: Raio[] = [2, 5, 10]
// Lojas que aparecem no cartão antes de "Ver todas".
const LOJAS_NO_CARTAO = 3


function NomeEDistancia({ loja }: { loja: LojaDoPreco }) {
  const distancia = textoDistancia(loja.distancia_km)
  return (
    <>
      {nomeDaLojaParaMostrar(loja)}
      {distancia && <span className="text-muted"> · a {distancia}</span>}
    </>
  )
}


function precoComMedida(preco: string, medida: string) {
  return `${formatarMoeda(Number(preco))}${medida === 'kg' ? '/kg' : ''}`
}


function maisBaratoVisto(lojas: PrecoNaLoja[]) {
  if (lojas.length === 0) return null
  const medida = lojas[0].medida
  return lojas
    .filter((linha) => linha.medida === medida)
    .reduce((menor, linha) => (Number(linha.preco) < Number(menor.preco) ? linha : menor))
}


function ComoChegar({ loja, pequeno = false }: { loja: LojaDoPreco; pequeno?: boolean }) {
  return (
    <a
      href={linkComoChegar(loja)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Como chegar em ${nomeDaLojaParaMostrar(loja)}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50 font-semibold text-brand-800 transition hover:bg-brand-100 ${
        pequeno ? 'h-9 px-2.5 text-xs' : 'h-10 px-3 text-sm'
      }`}
    >
      <Navigation size={pequeno ? 14 : 16} aria-hidden="true" />
      Como chegar
    </a>
  )
}


function LinhaDaLoja({ linha }: { linha: PrecoNaLoja }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <LogoDaLoja loja={linha.loja} tamanho="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold"><NomeEDistancia loja={linha.loja} /></p>
        {linha.loja.endereco && (
          <p className="truncate text-xs text-muted">{linha.loja.endereco}</p>
        )}
        <p className="text-xs text-muted">
          {quandoFoi(linha.data)}
          {linha.desatualizado && (
            <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
              pode ter mudado
            </span>
          )}
        </p>
      </div>
      <p className={`shrink-0 font-semibold tabular-nums ${linha.desatualizado ? 'text-muted' : 'text-ink'}`}>
        {precoComMedida(linha.preco, linha.medida)}
      </p>
      <ComoChegar loja={linha.loja} pequeno />
    </li>
  )
}


function CartaoDoProduto({ resumo }: { resumo: ResumoDePreco }) {
  const [aberto, setAberto] = useState(false)
  const [produto, setProduto] = useState(resumo.produto)
  const { mais_barato_agora: agora, menor_no_periodo: menor } = resumo
  const detalhes = [produto.brand, produto.embalagem].filter(Boolean).join(' · ')
  // Sem preço de hoje ou ontem: mostra o mais barato entre os últimos preços
  // de cada loja (mesma medida), com o aviso de que pode ter mudado.
  const visto = agora ? null : maisBaratoVisto(resumo.lojas)

  return (
    <li className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <FotoProduto url={produto.image_url} nome={produto.name} tamanho="md" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{produto.name}</p>
          {detalhes && <p className="text-sm text-muted">{detalhes}</p>}
          {!produto.image_url && (
            <div className="mt-1">
              <AdicionarFoto
                produtoId={produto.id}
                nome={produto.name}
                aoCompletar={(novo) =>
                  setProduto({
                    ...produto,
                    brand: novo.brand,
                    embalagem: (novo.package_size || novo.unit || '').trim(),
                    image_url: novo.image_url,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>

      {agora ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <LogoDaLoja loja={agora.loja} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">
                Mais barato agora
              </p>
              <p className="font-display text-2xl font-bold tabular-nums text-ink">
                {precoComMedida(agora.preco, agora.medida)}
              </p>
              <p className="truncate text-sm text-ink">
                <NomeEDistancia loja={agora.loja} /> · {quandoFoi(agora.data)}
              </p>
            </div>
          </div>
          <ComoChegar loja={agora.loja} />
        </div>
      ) : visto ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-canvas p-3">
          <div className="flex min-w-0 items-center gap-3">
            <LogoDaLoja loja={visto.loja} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Mais barato visto por último
              </p>
              <p className="font-display text-2xl font-bold tabular-nums text-ink">
                {precoComMedida(visto.preco, visto.medida)}
              </p>
              <p className="truncate text-sm text-ink">
                <NomeEDistancia loja={visto.loja} /> · {quandoFoi(visto.data)}
                <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                  pode ter mudado
                </span>
              </p>
            </div>
          </div>
          <ComoChegar loja={visto.loja} />
        </div>
      ) : null}

      {menor && (
        <p className="mt-3 text-sm text-muted">
          Menor preço em {menor.dias} dias:{' '}
          <span className="font-semibold text-ink">{precoComMedida(menor.preco, menor.medida)}</span>{' '}
          no {nomeDaLojaParaMostrar(menor.loja)} ({quandoFoi(menor.data)})
        </p>
      )}

      {/* As lojas do mais barato ao mais caro (preços de hoje primeiro). */}
      {resumo.lojas.length > 1 && (
        <>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
            {resumo.lojas.length} lojas com preço
          </p>
          <ul className="mt-1 divide-y divide-slate-100 border-t border-slate-100">
            {(aberto ? resumo.lojas : resumo.lojas.slice(0, LOJAS_NO_CARTAO)).map((linha) => (
              <LinhaDaLoja key={linha.loja.id} linha={linha} />
            ))}
          </ul>
        </>
      )}

      {resumo.lojas.length > LOJAS_NO_CARTAO && (
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          {aberto ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          {aberto ? 'Mostrar menos' : `Ver todas as ${resumo.lojas.length} lojas`}
        </button>
      )}
    </li>
  )
}


// Preços de Manaus a partir das notas fiscais: onde está mais barato agora e
// o menor preço em 7, 30 ou 90 dias (docs/PLANO_PRECOS_DA_CIDADE.md).
function PrecosDaCidade() {
  const [texto, setTexto] = useState('')
  const [dias, setDias] = useState<Periodo>(30)
  const [resultados, setResultados] = useState<ResumoDePreco[] | null>(null)
  const [erro, setErro] = useState('')
  const localizacao = useLocalizacao()
  const [raio, setRaio] = useState<Raio | null>(5)
  const origem = localizacao.origem

  useEffect(() => {
    const controle = new AbortController()
    const espera = setTimeout(() => {
      buscarPrecos(texto.trim(), dias, controle.signal, origem ? { origem, raio } : undefined)
        .then((dados) => {
          setResultados(dados)
          setErro('')
        })
        .catch((falha) => {
          if (falha instanceof Error && falha.name !== 'AbortError') {
            setErro(falha.message)
          }
        })
    }, 250)
    return () => {
      clearTimeout(espera)
      controle.abort()
    }
  }, [texto, dias, origem, raio])

  const termo = texto.trim()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Produtos com menor preço
      </h1>
      <p className="mt-2 text-muted">
        Preços reais de Manaus, das notas fiscais lidas no CompraFácil. Ninguém vê quem
        comprou: só a loja, o preço e a data.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Buscar produto (ex.: arroz)"
            aria-label="Buscar produto"
            className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div
          role="radiogroup"
          aria-label="Período do menor preço"
          className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 ring-1 ring-line"
        >
          {PERIODOS.map((periodo) => (
            <button
              key={periodo}
              type="button"
              role="radio"
              aria-checked={dias === periodo}
              onClick={() => setDias(periodo)}
              className={`h-10 rounded-lg px-3 text-sm font-semibold transition ${
                dias === periodo ? 'bg-brand-600 text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {periodo} dias
            </button>
          ))}
        </div>
      </div>

      {/* Perto de mim: a localização fica só nesta página (não é salva). */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {localizacao.estado === 'ativa' ? (
          <>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
              <MapPin size={16} aria-hidden="true" className="text-brand-600" />
              Perto de mim:
            </span>
            <div role="radiogroup" aria-label="Distância" className="flex flex-wrap gap-1">
              {[...RAIOS, null].map((opcao) => (
                <button
                  key={opcao ?? 'cidade'}
                  type="button"
                  role="radio"
                  aria-checked={raio === opcao}
                  onClick={() => setRaio(opcao)}
                  className={`h-9 rounded-lg px-3 text-sm font-semibold ring-1 transition ${
                    raio === opcao ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-muted ring-line hover:text-ink'
                  }`}
                >
                  {opcao ? `até ${opcao} km` : 'toda a cidade'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={localizacao.desligar}
              aria-label="Parar de usar minha localização"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-ink"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={localizacao.pedir}
            disabled={localizacao.estado === 'buscando'}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50 px-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 disabled:opacity-60"
          >
            <MapPin size={16} aria-hidden="true" />
            {localizacao.estado === 'buscando' ? 'Buscando sua localização...' : 'Lojas perto de mim'}
          </button>
        )}
        {origem && (
          <div className="w-full">
            <OndeEstou origem={origem} />
          </div>
        )}
        {localizacao.estado === 'negada' && (
          <p className="w-full text-sm text-amber-800">
            O navegador não liberou sua localização. Libere nas permissões do site para ver as lojas perto de você.
          </p>
        )}
        {localizacao.estado === 'indisponivel' && (
          <p className="w-full text-sm text-amber-800">Não foi possível obter sua localização agora.</p>
        )}
      </div>

      {erro && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {erro}
        </p>
      )}

      {resultados === null && !erro && (
        <p className="mt-6 text-center text-muted">Buscando preços...</p>
      )}

      {resultados !== null && resultados.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-display text-lg font-semibold">
            {origem && raio
              ? `Nenhuma loja com preço até ${raio} km de você`
              : termo ? `Ainda não temos preço de "${termo}"` : 'Ainda não há preços da cidade'}
          </p>
          <p className="mt-1 text-sm text-muted">
            Os preços aparecem quando alguém lê uma nota fiscal com esse produto.
          </p>
          <Link
            to="/scanner"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700"
          >
            Ler uma nota fiscal
          </Link>
        </div>
      )}

      {resultados !== null && resultados.length > 0 && (
        <>
          {!termo && (
            <h2 className="mb-2 mt-6 px-1 text-xs font-semibold uppercase tracking-wider text-muted">
              Preços mais recentes
            </h2>
          )}
          <ul className={`space-y-3 ${termo ? 'mt-6' : ''}`}>
            {resultados.map((resumo) => (
              <CartaoDoProduto key={resumo.produto.id} resumo={resumo} />
            ))}
          </ul>
        </>
      )}

      <p className="mt-8 text-center text-sm">
        <Link to="/promocoes/minhas" className="font-semibold text-brand-600 hover:text-brand-800">
          Ver produtos da sua lista mais baratos que a sua média
        </Link>
      </p>
    </div>
  )
}


export default PrecosDaCidade
