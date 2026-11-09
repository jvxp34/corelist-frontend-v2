import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, X } from 'lucide-react'

import type { TipoDeCodigo } from '../utils/lerCodigo'

export type { TipoDeCodigo }

interface Props {
  tipo: TipoDeCodigo
  titulo: string
  dica: string
  aoLer: (texto: string) => void
  aoFechar: () => void
}


// Depois deste tempo sem ler, sugere tirar uma foto.
const ESPERA_PARA_DICA_MS = 8000
// Intervalo entre as tentativas de leitura da câmera ao vivo.
const INTERVALO_MS = 180

// Câmera traseira em alta resolução e com foco contínuo: o QR code da nota
// fiscal é denso e, em 720p, sai borrado em muitos celulares.
const CAMERA: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    // Foco contínuo, quando o aparelho permite (não é padrão em todos).
    advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
  },
}


function mensagemDoErro(erro: unknown) {
  const nome = erro instanceof Error ? erro.name : ''

  if (!window.isSecureContext) {
    return 'A câmera só funciona no endereço com https.'
  }
  if (nome === 'NotAllowedError' || nome === 'SecurityError') {
    return 'O acesso à câmera foi negado. Libere a câmera para este site nas configurações do navegador, ou toque em "Tirar foto".'
  }
  if (nome === 'NotFoundError' || nome === 'OverconstrainedError') {
    return 'Não encontramos uma câmera neste aparelho. Toque em "Tirar foto".'
  }
  if (nome === 'NotReadableError') {
    return 'A câmera está sendo usada por outro aplicativo.'
  }
  return 'Não foi possível abrir a câmera. Toque em "Tirar foto" para ler o código por uma foto.'
}


// Um quadro do vídeo: alterna entre a imagem inteira e só o centro (onde fica
// a moldura), na resolução máxima da câmera — o QR code fica maior.
function quadroDoVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement, soOCentro: boolean) {
  const largura = video.videoWidth
  const altura = video.videoHeight
  if (!largura || !altura) {
    return null
  }
  const lado = Math.round(Math.min(largura, altura) * 0.8)
  const [x, y, w, h] = soOCentro
    ? [Math.round((largura - lado) / 2), Math.round((altura - lado) / 2), lado, lado]
    : [0, 0, largura, altura]
  canvas.width = w
  canvas.height = h
  const contexto = canvas.getContext('2d', { willReadFrequently: true })
  if (!contexto) {
    return null
  }
  contexto.drawImage(video, x, y, w, h, 0, 0, w, h)
  return contexto.getImageData(0, 0, w, h)
}


// Lê um QR code ou código de barras pela câmera ao vivo; se não pegar, a
// pessoa tira uma foto, que é nítida e focada (o caminho certo no iPhone).
// O leitor (zxing-wasm) só é baixado quando o leitor abre.
function LeitorDeCodigo({ tipo, titulo, dica, aoLer, aoFechar }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const pararCamera = useRef<(() => void) | null>(null)
  const lido = useRef(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [mostrarDica, setMostrarDica] = useState(false)
  const [cameraParada, setCameraParada] = useState(false)
  const [reinicio, setReinicio] = useState(0)
  const [lendoFoto, setLendoFoto] = useState(false)
  const [erroDaFoto, setErroDaFoto] = useState('')

  // As funções do componente pai mudam a cada render; a câmera não deve
  // reiniciar por isso.
  const callbacks = useRef({ aoLer, aoFechar })
  useEffect(() => {
    callbacks.current = { aoLer, aoFechar }
  })

  function entregar(texto: string) {
    if (lido.current) {
      return
    }
    lido.current = true
    pararCamera.current?.()
    navigator.vibrate?.(80)
    callbacks.current.aoLer(texto)
  }


  useEffect(() => {
    let desmontado = false
    let fluxo: MediaStream | null = null
    let espera: ReturnType<typeof setTimeout> | undefined
    const canvas = document.createElement('canvas')
    const dicaTimer = setTimeout(() => setMostrarDica(true), ESPERA_PARA_DICA_MS)

    function parar() {
      clearTimeout(espera)
      fluxo?.getTracks().forEach((trilha) => trilha.stop())
      fluxo = null
    }
    pararCamera.current = () => {
      parar()
      setCameraParada(true)
    }

    async function iniciar() {
      setErro('')
      setCarregando(true)
      setCameraParada(false)
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('sem câmera')
        }
        const [{ lerCodigo }, novoFluxo] = await Promise.all([
          import('../utils/lerCodigo'),
          navigator.mediaDevices.getUserMedia(CAMERA),
        ])
        fluxo = novoFluxo
        if (desmontado || !video.current) {
          parar()
          return
        }
        video.current.srcObject = fluxo
        await video.current.play()
        setCarregando(false)

        let tentativa = 0
        const procurar = async () => {
          if (desmontado || lido.current || !fluxo || !video.current) {
            return
          }
          tentativa += 1
          const quadro = quadroDoVideo(video.current, canvas, tentativa % 2 === 0)
          if (quadro) {
            try {
              const texto = await lerCodigo(quadro, tipo)
              if (texto) {
                entregar(texto)
                return
              }
            } catch {
              // quadro ruim: segue tentando
            }
          }
          espera = setTimeout(procurar, INTERVALO_MS)
        }
        procurar()
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
      clearTimeout(dicaTimer)
      parar()
    }
  }, [tipo, reinicio])


  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        callbacks.current.aoFechar()
      }
    }

    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [])


  async function aoEscolherFoto(campo: HTMLInputElement) {
    const arquivo = campo.files?.[0]
    campo.value = ''
    if (!arquivo) {
      return
    }
    setLendoFoto(true)
    setErroDaFoto('')
    try {
      const { lerCodigo } = await import('../utils/lerCodigo')
      const texto = await lerCodigo(arquivo, tipo)
      if (texto) {
        entregar(texto)
      } else {
        setErroDaFoto(
          tipo === 'qr'
            ? 'Não achei o QR code na foto. Tire de novo com o QR code inteiro, nítido e ocupando boa parte da foto.'
            : 'Não achei o código de barras na foto. Tire de novo mais de perto e sem reflexo.',
        )
      }
    } catch {
      setErroDaFoto('Não foi possível ler a foto. Tente de novo.')
    } finally {
      setLendoFoto(false)
    }
  }


  const moldura = tipo === 'qr'
    ? 'aspect-square w-[70%] max-w-72'
    : 'aspect-[2/1] w-[85%] max-w-96'

  const fotoEmDestaque = mostrarDica || Boolean(erro) || cameraParada

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

        {!erro && !cameraParada && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`${moldura} rounded-3xl border-4 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]`}
            />
          </div>
        )}

        {carregando && !erro && !cameraParada && (
          <p className="absolute inset-x-0 top-1/2 text-center text-sm text-white/80">
            Abrindo a câmera...
          </p>
        )}

        {(erro || cameraParada) && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-sm rounded-2xl bg-white p-5 text-center text-ink">
              <p className="text-[15px] font-medium">
                {erro || (lendoFoto ? 'Lendo a foto...' : 'Câmera pausada para tirar a foto.')}
              </p>
              {!lendoFoto && (
                <button
                  type="button"
                  onClick={() => setReinicio((n) => n + 1)}
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas"
                >
                  <RefreshCw size={18} aria-hidden="true" />
                  Ligar a câmera de novo
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center">
        {!erro && !cameraParada && (
          <p className="text-[15px] text-white/90">
            {mostrarDica
              ? tipo === 'qr'
                ? 'Não leu? Afaste um pouco o celular para focar, com o QR code inteiro na moldura, ou tire uma foto.'
                : 'Não leu? Afaste um pouco o celular para focar, ou tire uma foto.'
              : dica}
          </p>
        )}

        {erroDaFoto && (
          <p role="alert" className="rounded-xl bg-white/15 px-3 py-2 text-sm text-white">
            {erroDaFoto}
          </p>
        )}

        {/* Um <label> abre a câmera de foto em qualquer navegador (no iPhone,
            um clique "simulado" num campo escondido pode não abrir). A câmera
            ao vivo é desligada antes, senão o iPhone não abre a de foto. */}
        <label
          onClick={() => pararCamera.current?.()}
          className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition ${
            lendoFoto ? 'pointer-events-none opacity-60' : ''
          } ${
            fotoEmDestaque
              ? 'bg-white text-ink hover:bg-white/90'
              : 'bg-white/15 text-white hover:bg-white/25'
          }`}
        >
          <Camera size={20} aria-hidden="true" />
          {lendoFoto
            ? 'Lendo a foto...'
            : tipo === 'qr'
              ? 'Tirar foto do QR code'
              : 'Tirar foto do código'}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(evento) => void aoEscolherFoto(evento.currentTarget)}
          />
        </label>
      </div>
    </div>
  )
}


export default LeitorDeCodigo
