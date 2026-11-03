import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ExternalLink, MapPin, Search, Send, Sparkles } from 'lucide-react'

import FotoProduto from './FotoProduto'
import LogoDaLoja from './LogoDaLoja'
import OndeEstou from './OndeEstou'
import { useLocalizacao } from '../hooks/useLocalizacao'
import {
  perguntarAoAssistente,
  type LojaDoChat,
  type MensagemDoChat,
  type ProdutoDoChat,
  type RespostaDoAssistente,
} from '../services/assistente'
import { textoDistancia } from '../services/precos'
import { formatarMoeda } from '../utils/formatar'


// Fotos dos produtos citados (do catálogo do app).
function ProdutosDaResposta({ produtos }: { produtos: ProdutoDoChat[] }) {
  return (
    <ul className="mt-2 grid gap-2 sm:grid-cols-2" aria-label="Produtos">
      {produtos.map((produto) => (
        <li key={produto.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-2">
          <FotoProduto url={produto.imagem_url} nome={produto.nome} tamanho="sm" />
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{produto.nome}</p>
            <p className="truncate text-xs text-muted">
              {produto.preco
                ? `${formatarMoeda(Number(produto.preco))}${produto.medida === 'kg' ? '/kg' : ''}${produto.loja ? ` · ${produto.loja}` : ''}`
                : produto.embalagem ?? 'Foto ilustrativa'}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}


// Logos das lojas citadas, com a distância e a rota no mapa.
function LojasDaResposta({ lojas }: { lojas: LojaDoChat[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Lojas">
      {lojas.map((loja) => {
        const distancia = textoDistancia(loja.distancia_km)
        const nome = loja.marca ?? loja.nome
        return (
          <li key={`${nome}-${loja.distancia_km}`}>
            <a
              href={loja.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Como chegar em ${nome}`}
              className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-xs text-ink transition hover:border-brand-600"
            >
              <LogoDaLoja loja={{ id: 0, nome: loja.nome, marca: loja.marca, icone: loja.icone, endereco: '' }} tamanho="sm" />
              <span className="truncate font-semibold">{nome}</span>
              {distancia && <span className="shrink-0 text-muted">· {distancia}</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}


const SUGESTOES = [
  'Onde tem arroz mais barato perto de mim?',
  'Qual o menor preço do café?',
  'Onde compro leite mais barato perto de mim?',
]


// Chat do Início: pergunta onde comprar mais barato. A IA (Gemini ou Groq,
// grátis) consulta os mercados perto (OpenStreetMap), promoções na internet
// (Tavily) e os preços das notas fiscais; as fontes aparecem na resposta.
function AssistentePrecos() {
  const [mensagens, setMensagens] = useState<MensagemDoChat[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [fonte, setFonte] = useState<RespostaDoAssistente['fonte'] | null>(null)
  const localizacao = useLocalizacao()
  const fim = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fim.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [mensagens, enviando])

  async function enviar(pergunta: string) {
    const limpa = pergunta.trim()
    if (!limpa || enviando) return

    const historico: MensagemDoChat[] = [...mensagens, { papel: 'usuario', texto: limpa }]
    setMensagens(historico)
    setTexto('')
    setErro('')
    setEnviando(true)
    try {
      const { resposta, fonte, fontes, produtos, lojas } = await perguntarAoAssistente(historico, localizacao.origem)
      setFonte(fonte)
      setMensagens([...historico, { papel: 'assistente', texto: resposta, fontes, produtos, lojas }])
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'O assistente não respondeu.')
    } finally {
      setEnviando(false)
    }
  }

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault()
    void enviar(texto)
  }

  return (
    <section
      aria-labelledby="titulo-assistente"
      className="rounded-2xl border border-line bg-white p-6 sm:p-7 lg:col-span-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 id="titulo-assistente" className="font-display text-lg font-semibold">
              Assistente de preços
            </h2>
            <p className="text-sm text-muted">
              Pergunte onde comprar mais barato perto de você.
            </p>
          </div>
        </div>

        {localizacao.estado === 'ativa' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">
            <MapPin size={14} aria-hidden="true" />
            Usando sua localização
          </span>
        ) : (
          <button
            type="button"
            onClick={localizacao.pedir}
            disabled={localizacao.estado === 'buscando'}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800 disabled:opacity-60"
          >
            <MapPin size={16} aria-hidden="true" />
            {localizacao.estado === 'buscando' ? 'Buscando...' : 'Usar minha localização'}
          </button>
        )}
      </div>

      {localizacao.origem && <OndeEstou origem={localizacao.origem} />}

      {mensagens.length > 0 && (
        <div
          aria-live="polite"
          className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-canvas p-3"
        >
          {mensagens.map((mensagem, indice) => (
            <div
              key={indice}
              className={`flex ${mensagem.papel === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[85%]">
                <p
                  className={`whitespace-pre-line rounded-2xl px-3.5 py-2 text-[15px] ${
                    mensagem.papel === 'usuario'
                      ? 'bg-brand-600 text-white'
                      : 'border border-line bg-white text-ink'
                  }`}
                >
                  {mensagem.texto}
                </p>
                {mensagem.produtos && mensagem.produtos.length > 0 && (
                  <ProdutosDaResposta produtos={mensagem.produtos} />
                )}
                {mensagem.lojas && mensagem.lojas.length > 0 && (
                  <LojasDaResposta lojas={mensagem.lojas} />
                )}
                {/* Os lugares do mapa já aparecem nas lojas: aqui, só a internet. */}
                {mensagem.fontes && mensagem.fontes.some((f) => f.tipo !== 'maps' || !mensagem.lojas?.length) && (
                  <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Fontes da resposta">
                    {mensagem.fontes.filter((f) => f.tipo !== 'maps' || !mensagem.lojas?.length).map((fonteDaResposta) => (
                      <li key={fonteDaResposta.url}>
                        <a
                          href={fonteDaResposta.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-[16rem] items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-xs text-muted transition hover:border-brand-600 hover:text-brand-800"
                        >
                          {fonteDaResposta.tipo === 'maps' ? (
                            <MapPin size={12} aria-hidden="true" />
                          ) : fonteDaResposta.tipo === 'busca' ? (
                            <Search size={12} aria-hidden="true" />
                          ) : (
                            <ExternalLink size={12} aria-hidden="true" />
                          )}
                          <span className="truncate">{fonteDaResposta.titulo}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          {enviando && (
            <p className="text-sm text-muted">Procurando os preços...</p>
          )}
          <div ref={fim} />
        </div>
      )}

      {mensagens.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGESTOES.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => void enviar(sugestao)}
              disabled={enviando}
              className="rounded-full border border-line px-3 py-1.5 text-sm text-ink transition hover:border-brand-600 hover:text-brand-800 disabled:opacity-60"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}

      {erro && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <form onSubmit={aoEnviar} className="mt-4 flex gap-2">
        <input
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          maxLength={500}
          placeholder="Ex.: onde o feijão está mais barato?"
          aria-label="Pergunta para o assistente"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={enviando || !texto.trim()}
          aria-label="Enviar pergunta"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>

      <p className="mt-2 text-xs text-muted">
        Mercados do OpenStreetMap, promoções da internet e preços das notas fiscais do app; os preços podem ter mudado.
        {fonte === 'gemini' && ' Resposta escrita pelo Gemini, do Google.'}
        {fonte === 'groq' && ' Resposta escrita por um modelo aberto, via Groq.'}
        {fonte === 'claude' && ' Resposta escrita pelo Claude, da Anthropic.'}
      </p>
    </section>
  )
}


export default AssistentePrecos
