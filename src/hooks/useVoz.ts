import { useCallback, useEffect, useRef, useState } from 'react'

// Comando de voz com o reconhecimento de fala do próprio navegador (Web
// Speech API): Chrome, Edge e Safari, inclusive no iPhone. O navegador manda
// o áudio para o serviço de fala dele (Google ou Apple); o app só recebe o
// texto. Onde não existe (Firefox), o botão não aparece.

interface ResultadoDaFala {
  isFinal: boolean
  0: { transcript: string }
}

interface EventoDaFala {
  resultIndex: number
  results: ArrayLike<ResultadoDaFala>
}

interface Reconhecedor {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((evento: EventoDaFala) => void) | null
  onerror: ((evento: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type ConstrutorDoReconhecedor = new () => Reconhecedor

function construtor(): ConstrutorDoReconhecedor | null {
  if (typeof window === 'undefined') return null
  const janela = window as unknown as {
    SpeechRecognition?: ConstrutorDoReconhecedor
    webkitSpeechRecognition?: ConstrutorDoReconhecedor
  }
  return janela.SpeechRecognition ?? janela.webkitSpeechRecognition ?? null
}

const ERROS: Record<string, string> = {
  'not-allowed': 'Permita o uso do microfone para falar com o assistente.',
  'service-not-allowed': 'Permita o uso do microfone para falar com o assistente.',
  'no-speech': 'Não ouvi nada. Toque no microfone e fale de novo.',
  'audio-capture': 'Não achei um microfone neste aparelho.',
  network: 'O reconhecimento de voz precisa de internet.',
}

// parcial: o texto enquanto a pessoa fala; final: a frase completa.
export function useVoz(aoTerminar: (frase: string) => void) {
  const [ouvindo, setOuvindo] = useState(false)
  const [parcial, setParcial] = useState('')
  const [erro, setErro] = useState('')
  const reconhecedor = useRef<Reconhecedor | null>(null)
  const callback = useRef(aoTerminar)
  const disponivel = construtor() !== null

  useEffect(() => {
    callback.current = aoTerminar
  }, [aoTerminar])

  useEffect(() => () => reconhecedor.current?.abort(), [])

  const parar = useCallback(() => {
    reconhecedor.current?.stop()
  }, [])

  const ouvir = useCallback(() => {
    const Construtor = construtor()
    if (!Construtor) return
    reconhecedor.current?.abort()

    const novo = new Construtor()
    novo.lang = 'pt-BR'
    novo.interimResults = true
    novo.continuous = false
    novo.maxAlternatives = 1
    let frase = ''

    novo.onresult = (evento) => {
      let final = ''
      let enquanto = ''
      for (let i = 0; i < evento.results.length; i += 1) {
        const resultado = evento.results[i]
        if (resultado.isFinal) final += resultado[0].transcript
        else enquanto += resultado[0].transcript
      }
      if (final) frase = final.trim()
      setParcial((final + enquanto).trim())
    }
    novo.onerror = (evento) => {
      if (evento.error !== 'aborted') {
        setErro(ERROS[evento.error] ?? 'Não consegui ouvir. Tente de novo ou escreva a pergunta.')
      }
    }
    novo.onend = () => {
      setOuvindo(false)
      setParcial('')
      reconhecedor.current = null
      if (frase) callback.current(frase)
    }

    reconhecedor.current = novo
    setErro('')
    setParcial('')
    setOuvindo(true)
    try {
      novo.start()
    } catch {
      setOuvindo(false)
      setErro('Não consegui ligar o microfone. Tente de novo.')
    }
  }, [])

  return { disponivel, ouvindo, parcial, erro, ouvir, parar }
}
