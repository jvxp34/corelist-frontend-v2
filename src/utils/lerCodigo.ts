// Leitura de QR code e código de barras com o ZXing-C++ (zxing-wasm): bem
// mais robusto que a versão em JavaScript para o QR code das notas fiscais,
// que vem impresso em papel térmico, amassado e com pouco contraste.
// O arquivo .wasm é servido pelo próprio site (nunca por uma CDN de fora).
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


// Texto do primeiro código válido, ou null.
export async function lerCodigo(
  imagem: ImageData | Blob,
  tipo: TipoDeCodigo,
): Promise<string | null> {
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
