import { useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'


export type TipoDeCodigo = 'qr' | 'barras'

interface Props {
  tipo: TipoDeCodigo
  titulo: string
  dica: string
  aoLer: (texto: string) => void
  aoFechar: () => void
}


// Depois deste tempo sem ler, sugere tirar uma foto.
const ESPERA_PARA_DICA_MS = 8000

// Leitor nativo do navegador (Chrome no Android); o Safari do iPhone não tem.
interface DetectorNativo {
  detect: (imagem: CanvasImageSource | ImageBitmap) => Promise<{ rawValue: string }[]>
}
type ConstrutorDoDetector = {
  new (opcoes: { formats: string[] }): DetectorNativo
  getSupportedFormats?: () => Promise<string[]>
}

const FORMATOS_NATIVOS = {
  qr: ['qr_code'],
  barras: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'itf'],
}


async function detectorNativo(tipo: TipoDeCodigo): Promise<DetectorNativo | null> {
  const Construtor = (window as unknown as { BarcodeDetector?: ConstrutorDoDetector }).BarcodeDetector
  if (!Construtor) {
    return null
  }
  try {
    const suportados = (await Construtor.getSupportedFormats?.()) ?? []
    const formatos = FORMATOS_NATIVOS[tipo].filter((formato) => suportados.includes(formato))
    return formatos.length > 0 ? new Construtor({ formats: formatos }) : null
  } catch {
    return null
  }
}


async function leitorZxing(tipo: TipoDeCodigo) {
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

  return new BrowserMultiFormatReader(dicas, { delayBetweenScanAttempts: 120 })
}


// A foto do celular é grande (12 MP ou mais): reduz para a leitura ficar
// rápida, mas com resolução suficiente para o QR code denso da nota.
function fotoReduzida(imagem: ImageBitmap, ladoMaximo: number) {
  const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(imagem.width * escala)
  canvas.height = Math.round(imagem.height * escala)
  canvas.getContext('2d')?.drawImage(imagem, 0, 0, canvas.width, canvas.height)
  return canvas
}


async function lerDaFoto(arquivo: File, tipo: TipoDeCodigo): Promise<string | null> {
  const imagem = await createImageBitmap(arquivo)
  try {
    const nativo = await detectorNativo(tipo)
    if (nativo) {
      const achados = await nativo.detect(imagem)
      if (achados[0]?.rawValue) {
        return achados[0].rawValue
      }
    }
    const leitor = await leitorZxing(tipo)
    // Tenta em tamanhos diferentes: às vezes o código pequeno só sai no maior.
    for (const lado of [1600, 2400, 1000]) {
      try {
        return leitor.decodeFromCanvas(fotoReduzida(imagem, lado)).getText()
      } catch {
        // não achou neste tamanho: tenta o próximo
      }
    }
    return null
  } finally {
    imagem.close()
  }
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
    return 'Não encontramos uma câmera neste aparelho.'
  }
  if (nome === 'NotReadableError') {
    return 'A câmera está sendo usada por outro aplicativo.'
  }
  return 'Não foi possível abrir a câmera. Toque em "Tirar foto" para ler o código por uma foto.'
}


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


// Lê um QR code ou código de barras pela câmera ao vivo; se não pegar, a
// pessoa pode tirar uma foto, que é nítida e focada.
// A biblioteca ZXing só é baixada quando o leitor abre.
function LeitorDeCodigo({ tipo, titulo, dica, aoLer, aoFechar }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const foto = useRef<HTMLInputElement>(null)
  const lido = useRef(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [mostrarDica, setMostrarDica] = useState(false)
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
    navigator.vibrate?.(80)
    callbacks.current.aoLer(texto)
  }


  useEffect(() => {
    let parar: (() => void) | null = null
    let desmontado = false
    const dicaTimer = setTimeout(() => setMostrarDica(true), ESPERA_PARA_DICA_MS)

    async function comDetectorNativo(detector: DetectorNativo) {
      const fluxo = await navigator.mediaDevices.getUserMedia(CAMERA)
      if (desmontado || !video.current) {
        fluxo.getTracks().forEach((trilha) => trilha.stop())
        return
      }
      video.current.srcObject = fluxo
      await video.current.play()
      let ativo = true
      parar = () => {
        ativo = false
        fluxo.getTracks().forEach((trilha) => trilha.stop())
      }
      setCarregando(false)

      const procurar = async () => {
        if (!ativo || lido.current || !video.current) {
          return
        }
        try {
          const achados = await detector.detect(video.current)
          if (achados[0]?.rawValue) {
            parar?.()
            entregar(achados[0].rawValue)
            return
          }
        } catch {
          // quadro ainda sem imagem: segue tentando
        }
        setTimeout(procurar, 120)
      }
      procurar()
    }

    async function comZxing() {
      const leitor = await leitorZxing(tipo)
      if (desmontado || !video.current) {
        return
      }
      const controles = await leitor.decodeFromConstraints(
        CAMERA,
        video.current,
        (resultado, _erro, controlesDaLeitura) => {
          if (!resultado || lido.current) {
            return
          }
          controlesDaLeitura.stop()
          entregar(resultado.getText())
        },
      )
      parar = () => controles.stop()
      if (desmontado) {
        parar()
      } else {
        setCarregando(false)
      }
    }

    async function iniciar() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('sem câmera')
        }
        const nativo = await detectorNativo(tipo)
        if (nativo) {
          await comDetectorNativo(nativo)
        } else {
          await comZxing()
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
      clearTimeout(dicaTimer)
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


  async function aoEscolherFoto(arquivo: File | undefined) {
    if (!arquivo) {
      return
    }
    setLendoFoto(true)
    setErroDaFoto('')
    try {
      const texto = await lerDaFoto(arquivo, tipo)
      if (texto) {
        entregar(texto)
      } else {
        setErroDaFoto(
          tipo === 'qr'
            ? 'Não achei o QR code na foto. Tire de novo mais de perto, com o QR code inteiro e nítido.'
            : 'Não achei o código de barras na foto. Tire de novo mais de perto e sem reflexo.',
        )
      }
    } catch {
      setErroDaFoto('Não foi possível ler a foto. Tente de novo.')
    } finally {
      setLendoFoto(false)
      if (foto.current) {
        foto.current.value = ''
      }
    }
  }


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
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-line px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center">
        {!erro && (
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

        <input
          ref={foto}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(evento) => void aoEscolherFoto(evento.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => foto.current?.click()}
          disabled={lendoFoto}
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition disabled:opacity-60 ${
            mostrarDica || erro
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
        </button>
      </div>
    </div>
  )
}


export default LeitorDeCodigo
