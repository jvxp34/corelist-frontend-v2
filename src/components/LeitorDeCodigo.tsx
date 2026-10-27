import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'


export type TipoDeCodigo = 'qr' | 'barras'

interface Props {
  tipo: TipoDeCodigo
  titulo: string
  dica: string
  aoLer: (texto: string) => void
  aoFechar: () => void
}


function mensagemDoErro(erro: unknown) {
  const nome = erro instanceof Error ? erro.name : ''

  if (!window.isSecureContext) {
    return 'A câmera só funciona no endereço com https.'
  }
  if (nome === 'NotAllowedError' || nome === 'SecurityError') {
    return 'O acesso à câmera foi negado. Libere a câmera para este site nas configurações do navegador e tente de novo.'
  }
  if (nome === 'NotFoundError' || nome === 'OverconstrainedError') {
    return 'Não encontramos uma câmera neste aparelho.'
  }
  if (nome === 'NotReadableError') {
    return 'A câmera está sendo usada por outro aplicativo.'
  }
  return 'Não foi possível abrir a câmera.'
}


// Abre a câmera traseira e lê um QR code ou código de barras.
// A biblioteca ZXing só é baixada quando o leitor abre.
function LeitorDeCodigo({ tipo, titulo, dica, aoLer, aoFechar }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const lido = useRef(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  // As funções do componente pai mudam a cada render; a câmera não deve
  // reiniciar por isso.
  const callbacks = useRef({ aoLer, aoFechar })
  useEffect(() => {
    callbacks.current = { aoLer, aoFechar }
  })


  useEffect(() => {
    let parar: (() => void) | null = null
    let desmontado = false

    async function iniciar() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('sem câmera')
        }

        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const { BarcodeFormat, DecodeHintType } = await import('@zxing/library')

        const formatos = tipo === 'qr'
          ? [BarcodeFormat.QR_CODE]
          : [
              BarcodeFormat.EAN_13,
              BarcodeFormat.EAN_8,
              BarcodeFormat.UPC_A,
              BarcodeFormat.UPC_E,
              BarcodeFormat.CODE_128,
              BarcodeFormat.ITF,
            ]

        const dicas = new Map()
        dicas.set(DecodeHintType.POSSIBLE_FORMATS, formatos)
        dicas.set(DecodeHintType.TRY_HARDER, true)

        const leitor = new BrowserMultiFormatReader(dicas, {
          delayBetweenScanAttempts: 150,
        })

        if (desmontado || !video.current) {
          return
        }

        const controles = await leitor.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          video.current,
          (resultado, _erro, controlesDaLeitura) => {
            if (!resultado || lido.current) {
              return
            }
            lido.current = true
            controlesDaLeitura.stop()
            navigator.vibrate?.(80)
            callbacks.current.aoLer(resultado.getText())
          },
        )

        parar = () => controles.stop()
        if (desmontado) {
          parar()
        } else {
          setCarregando(false)
        }
      } catch (falha) {
        if (!desmontado) {
          setErro(mensagemDoErro(falha))
          setCarregando(false)
        }
      }
    }

    iniciar()

    return () => {
      desmontado = true
      parar?.()
    }
  }, [tipo])


  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        callbacks.current.aoFechar()
      }
    }

    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [])


  const moldura = tipo === 'qr'
    ? 'aspect-square w-[70%] max-w-72'
    : 'aspect-[2/1] w-[85%] max-w-96'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <h2 className="font-display text-lg font-semibold">{titulo}</h2>

        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar a câmera"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video
          ref={video}
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!erro && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`${moldura} rounded-3xl border-4 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]`}
            />
          </div>
        )}

        {carregando && !erro && (
          <p className="absolute inset-x-0 top-1/2 text-center text-sm text-white/80">
            Abrindo a câmera...
          </p>
        )}

        {erro && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-sm rounded-2xl bg-white p-5 text-center text-ink">
              <p className="text-[15px] font-medium">{erro}</p>
              <button
                type="button"
                onClick={aoFechar}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>

      {!erro && (
        <p className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-[15px] text-white/90">
          {dica}
        </p>
      )}
    </div>
  )
}


export default LeitorDeCodigo
