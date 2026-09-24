import { useRef, useState } from 'react'

import {
  Camera,
  CheckCircle2,
  FileImage,
  ImagePlus,
  QrCode,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'

function Scanner() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [arquivoSelecionado, setArquivoSelecionado] =
    useState<string | null>(null)

  const [processando, setProcessando] = useState(false)
  const [resultado, setResultado] = useState(false)

  function selecionarArquivo(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo = event.target.files?.[0]

    if (!arquivo) {
      return
    }

    setArquivoSelecionado(arquivo.name)
    setResultado(false)
  }

  function removerArquivo() {
    setArquivoSelecionado(null)
    setResultado(false)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  function processarNota() {
    if (!arquivoSelecionado) {
      return
    }

    setProcessando(true)

    setTimeout(() => {
      setProcessando(false)
      setResultado(true)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
            <ScanLine size={20} />
          </div>

          <span className="text-sm font-semibold text-blue-600">
            Importação inteligente
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
          Ler nota fiscal
        </h1>

        <p className="mt-2 max-w-2xl text-gray-500">
          Escaneie o QR Code ou envie uma imagem da sua
          nota fiscal para importar sua compra.
        </p>
      </div>

      {/* Área principal */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Scanner */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8">
              {/* Elementos decorativos */}
              <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-blue-500/10" />

              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/10" />

              <div className="relative z-10 w-full max-w-md">
                <div className="relative rounded-3xl border-2 border-dashed border-white/30 bg-white/5 p-10 backdrop-blur-sm">
                  {/* Cantos do scanner */}
                  <div className="absolute left-5 top-5 h-8 w-8 border-l-2 border-t-2 border-cyan-400" />

                  <div className="absolute right-5 top-5 h-8 w-8 border-r-2 border-t-2 border-cyan-400" />

                  <div className="absolute bottom-5 left-5 h-8 w-8 border-b-2 border-l-2 border-cyan-400" />

                  <div className="absolute bottom-5 right-5 h-8 w-8 border-b-2 border-r-2 border-cyan-400" />

                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                      <QrCode size={44} />
                    </div>

                    <h2 className="mt-6 text-xl font-bold text-white">
                      Aponte para o QR Code
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Posicione o QR Code da nota dentro da
                      área de leitura.
                    </p>

                    <button
                      type="button"
                      className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      <Camera size={18} />
                      Abrir câmera
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Ou envie uma imagem
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG ou foto da nota fiscal.
                  </p>
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={selecionarArquivo}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Upload size={18} />
                  Selecionar imagem
                </button>
              </div>

              {/* Arquivo */}
              {arquivoSelecionado && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-white p-2 text-blue-600">
                      <FileImage size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        Imagem selecionada
                      </p>

                      <p className="truncate text-sm text-gray-500">
                        {arquivoSelecionado}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removerArquivo}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-red-500"
                    aria-label="Remover imagem"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Processar */}
              {arquivoSelecionado && !resultado && (
                <button
                  type="button"
                  onClick={processarNota}
                  disabled={processando}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ScanLine size={18} />

                  {processando
                    ? 'Processando nota...'
                    : 'Processar nota fiscal'}
                </button>
              )}

              {/* Resultado demonstrativo */}
              {resultado && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={22}
                      className="mt-0.5 text-green-600"
                    />

                    <div>
                      <h3 className="font-bold text-green-900">
                        Nota processada
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-green-700">
                        A interface de importação está pronta.
                        A leitura real dos dados será conectada
                        ao backend posteriormente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lateral */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Como funciona?
            </h2>

            <div className="mt-5 space-y-5">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  1
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Escaneie sua nota
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Aponte a câmera para o QR Code da nota
                    fiscal.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  2
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    CoreList interpreta os dados
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Os produtos e valores poderão ser
                    identificados automaticamente.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  3
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Sua compra é registrada
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Os dados poderão alimentar seu histórico
                    e seus relatórios.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
                <ImagePlus size={20} />
              </div>

              <div>
                <h3 className="font-bold text-blue-900">
                  Dica
                </h3>

                <p className="mt-1 text-sm text-blue-700">
                  Tire uma foto nítida e com boa iluminação
                  para facilitar a leitura da nota.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades futuras */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <QrCode
            size={22}
            className="text-blue-600"
          />

          <h3 className="mt-4 font-bold text-gray-900">
            QR Code
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Leitura rápida do código da nota fiscal.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <FileImage
            size={22}
            className="text-purple-600"
          />

          <h3 className="mt-4 font-bold text-gray-900">
            Imagem da nota
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Envie uma foto quando não puder utilizar a
            câmera.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <CheckCircle2
            size={22}
            className="text-green-600"
          />

          <h3 className="mt-4 font-bold text-gray-900">
            Importação automática
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Os dados poderão ser adicionados ao histórico
            automaticamente.
          </p>
        </div>
      </div>

      {/* Aviso */}
      <div className="mt-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
        <p className="text-sm leading-6 text-yellow-800">
          <strong>Modo de demonstração:</strong> nesta etapa
          estamos preparando a interface. A câmera, leitura
          do QR Code e interpretação da nota serão integradas
          posteriormente ao backend.
        </p>
      </div>
    </div>
  )
}

export default Scanner