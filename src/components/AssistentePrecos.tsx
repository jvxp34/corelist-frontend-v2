import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ExternalLink, MapPin, Search, Send, Sparkles } from 'lucide-react'

import { useLocalizacao } from '../hooks/useLocalizacao'
import {
  perguntarAoAssistente,
  type MensagemDoChat,
  type RespostaDoAssistente,
} from '../services/assistente'


const SUGESTOES = [
  'Onde o arroz está mais barato?',
  'Qual o menor preço do café?',
  'Onde compro leite mais barato perto de mim?',
]


// Chat do Início: pergunta onde comprar mais barato. Com o Gemini, a resposta
// vem do Google Maps e da busca do Google (com as fontes); os preços das
// notas fiscais entram como extra.
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
      const { resposta, fonte, fontes } = await perguntarAoAssistente(historico, localizacao.origem)
      setFonte(fonte)
      setMensagens([...historico, { papel: 'assistente', texto: resposta, fontes }])
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
                {mensagem.fontes && mensagem.fontes.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Fontes da resposta">
                    {mensagem.fontes.map((fonteDaResposta) => (
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
        Preços das notas fiscais lidas no app; podem ter mudado.
        {fonte === 'gemini' && ' Respostas do Gemini, com Google Maps e busca do Google.'}
        {fonte === 'claude' && ' Respostas escritas pelo Claude, da Anthropic.'}
      </p>
    </section>
  )
}


export default AssistentePrecos
