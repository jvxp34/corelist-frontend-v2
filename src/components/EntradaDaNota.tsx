import { useState } from 'react'
import { QrCode } from 'lucide-react'

import LeitorDeCodigo from './LeitorDeCodigo'
import { pareceLinkDeNota } from '../services/nfce'


const BOTAO_PRINCIPAL =
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const BOTAO_SECUNDARIO =
  'inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60'


interface Props {
  // Chamado com um link que parece ser de nota do Amazonas.
  aoLer: (link: string) => void
  lendo: boolean
  erro: string
  aoErro: (mensagem: string) => void
}


// Ler a nota fiscal: QR code pela câmera ou link colado.
function EntradaDaNota({ aoLer, lendo, erro, aoErro }: Props) {
  const [cameraAberta, setCameraAberta] = useState(false)
  const [link, setLink] = useState('')

  function tentar(texto: string) {
    const limpo = texto.trim()
    if (!pareceLinkDeNota(limpo)) {
      aoErro(
        'Este não parece ser o QR code de uma nota fiscal do Amazonas. ' +
          'Use o QR code impresso no rodapé da nota.',
      )
      return
    }
    aoErro('')
    aoLer(limpo)
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <button
        type="button"
        onClick={() => {
          aoErro('')
          setCameraAberta(true)
        }}
        disabled={lendo}
        className={BOTAO_PRINCIPAL}
      >
        <QrCode size={22} aria-hidden="true" />
        Ler o QR code da nota
      </button>

      <p className="mt-2 text-center text-sm text-muted">
        O QR code fica no rodapé da nota fiscal (NFC-e).
      </p>

      <div className="my-5 flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        ou cole o link do QR code
        <span className="h-px flex-1 bg-line" />
      </div>

      <form
        onSubmit={(evento) => {
          evento.preventDefault()
          tentar(link)
        }}
        className="flex gap-2"
      >
        <label htmlFor="link-nota" className="sr-only">
          Link da nota fiscal
        </label>
        <input
          id="link-nota"
          type="url"
          inputMode="url"
          autoComplete="off"
          value={link}
          onChange={(evento) => setLink(evento.target.value)}
          placeholder="https://sistemas.sefaz.am.gov.br/..."
          className="h-11 w-full min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={lendo || link.trim() === ''}
          className={BOTAO_SECUNDARIO}
        >
          {lendo ? 'Lendo...' : 'Ler'}
        </button>
      </form>

      {lendo && (
        <p role="status" className="mt-4 text-center text-sm text-muted">
          Consultando a nota na Sefaz...
        </p>
      )}

      {erro && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {erro}
        </div>
      )}

      {cameraAberta && (
        <LeitorDeCodigo
          tipo="qr"
          titulo="Ler nota fiscal"
          dica="Aponte para o QR code no rodapé da nota."
          aoFechar={() => setCameraAberta(false)}
          aoLer={(texto) => {
            setCameraAberta(false)
            setLink(texto)
            tentar(texto)
          }}
        />
      )}
    </section>
  )
}


export default EntradaDaNota
