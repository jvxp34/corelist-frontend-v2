import { useState } from 'react'
import { Download, Share, SquarePlus, X } from 'lucide-react'

import { useInstalacao } from '../hooks/useInstalacao'


// Botão "Instalar o app": no Android abre a instalação do navegador; no
// iPhone mostra o passo a passo do Safari. Some quando já está instalado ou
// quando o navegador não permite instalar.
function InstalarApp({
  variante = 'cartao',
  aoFechar,
}: {
  variante?: 'cartao' | 'linha'
  aoFechar?: () => void
}) {
  const { disponivel, podeInstalarDireto, ehIos, instalar } =
    useInstalacao()

  const [mostrarPassos, setMostrarPassos] = useState(false)

  if (!disponivel) {
    return null
  }

  function aoClicar() {
    if (podeInstalarDireto) {
      instalar()
    } else if (ehIos) {
      setMostrarPassos((atual) => !atual)
    }
  }

  const passosIos = mostrarPassos && ehIos && (
    <ol className="mt-3 space-y-2.5 text-sm text-slate-700">
      <li className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-line">
          <Share size={16} aria-hidden="true" />
        </span>
        Toque em <strong>Compartilhar</strong> na barra do Safari.
      </li>
      <li className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-line">
          <SquarePlus size={16} aria-hidden="true" />
        </span>
        Escolha <strong>Adicionar à Tela de Início</strong>.
      </li>
      <li className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-semibold text-brand-600 ring-1 ring-line">
          3
        </span>
        Toque em <strong>Adicionar</strong>.
      </li>
    </ol>
  )

  if (variante === 'linha') {
    return (
      <div>
        <button
          type="button"
          onClick={aoClicar}
          aria-expanded={ehIos && !podeInstalarDireto ? mostrarPassos : undefined}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-base font-medium text-ink hover:bg-canvas"
        >
          <Download size={20} className="text-muted" aria-hidden="true" />
          Instalar o app
        </button>
        {passosIos && <div className="px-3 pb-2">{passosIos}</div>}
      </div>
    )
  }

  return (
    <section
      aria-label="Instalar o app"
      className="relative rounded-2xl bg-brand-50 p-4 pr-12 text-brand-800"
    >
      {aoFechar && (
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Dispensar"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-brand-800/70 hover:bg-white/60"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}

      <p className="font-semibold">Use o CompraFácil como app</p>
      <p className="mt-0.5 text-sm">
        Abre direto da tela inicial, em tela cheia, como um app.
      </p>

      <button
        type="button"
        onClick={aoClicar}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
      >
        <Download size={16} aria-hidden="true" />
        {podeInstalarDireto
          ? 'Instalar o app'
          : mostrarPassos
            ? 'Esconder o passo a passo'
            : 'Como instalar'}
      </button>

      {passosIos}
    </section>
  )
}


export default InstalarApp
