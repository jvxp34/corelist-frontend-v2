// Leitura de QR code e código de barras com o ZXing-C++ (zxing-wasm): bem
// mais robusto que a versão em JavaScript para o QR code das notas fiscais,
// que vem impresso em papel térmico, amassado e com pouco contraste.
// O .wasm é servido pelo próprio site (nunca por uma CDN de fora). A regra
// de reescrita do Amplify devolve a página do site para arquivos .wasm, por
// isso o build o grava com a extensão .wasm.js (vite.config.ts); o conteúdo
// é o mesmo. Este módulo só é baixado quando o leitor abre. Se o wasm falhar,
// usa o ZXing em JavaScript.
import { prepareZXingModule, readBarcodes, type ReaderOptions } from 'zxing-wasm/reader'
import enderecoDoWasm from 'zxing-wasm/reader/zxing_reader.wasm?url'


export type TipoDeCodigo = 'qr' | 'barras'

const FORMATOS: Record<TipoDeCodigo, ReaderOptions['formats']> = {
  qr: ['QRCode'],
  barras: ['EAN13', 'EAN8', 'UPCA', 'UPCE', 'Code128', 'ITF'],
}

let preparado = false

function preparar() {
  if (!preparado) {
    prepareZXingModule({
      overrides: {
        locateFile: (caminho: string, prefixo: string) =>
          caminho.endsWith('.wasm') ? enderecoDoWasm : prefixo + caminho,
      },
    })
    preparado = true
  }
}


let wasmFalhou = false


// Reserva: o ZXing em JavaScript (mais fraco, mas não depende do wasm).
async function lerComZxingJs(imagem: ImageData | Blob, tipo: TipoDeCodigo) {
  const { BrowserMultiFormatReader } = await import('@zxing/browser')
  const { BarcodeFormat, DecodeHintType } = await import('@zxing/library')
  const dicas = new Map()
  dicas.set(
    DecodeHintType.POSSIBLE_FORMATS,
    tipo === 'qr'
      ? [BarcodeFormat.QR_CODE]
      : [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.CODE_128, BarcodeFormat.ITF],
  )
  dicas.set(DecodeHintType.TRY_HARDER, true)
  const canvas = document.createElement('canvas')
  if (imagem instanceof Blob) {
    const bitmap = await createImageBitmap(imagem)
    const escala = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
    canvas.width = Math.round(bitmap.width * escala)
    canvas.height = Math.round(bitmap.height * escala)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
  } else {
    canvas.width = imagem.width
    canvas.height = imagem.height
    canvas.getContext('2d')?.putImageData(imagem, 0, 0)
  }
  try {
    return new BrowserMultiFormatReader(dicas).decodeFromCanvas(canvas).getText()
  } catch {
    return null
  }
}


// Texto do primeiro código válido, ou null.
export async function lerCodigo(
  imagem: ImageData | Blob,
  tipo: TipoDeCodigo,
): Promise<string | null> {
  if (wasmFalhou) {
    return lerComZxingJs(imagem, tipo)
  }
  try {
    return await lerComWasm(imagem, tipo)
  } catch {
    wasmFalhou = true
    return lerComZxingJs(imagem, tipo)
  }
}


async function lerComWasm(imagem: ImageData | Blob, tipo: TipoDeCodigo) {
  preparar()
  const achados = await readBarcodes(imagem, {
    formats: FORMATOS[tipo],
    tryHarder: true,
    tryRotate: true,
    tryInvert: false,
    tryDownscale: true,
    maxNumberOfSymbols: 1,
  })
  return achados.find((achado) => achado.isValid && achado.text)?.text ?? null
}
