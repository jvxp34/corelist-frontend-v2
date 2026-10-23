import { useState } from 'react'
import { Check, Eye, EyeOff } from 'lucide-react'

import Logo from './Logo'


const VANTAGENS = [
  'Listas de compras com orçamento',
  'Saldo e alerta antes de passar do limite',
  'Histórico com os preços que você pagou',
]


// Moldura das telas de entrada (login e cadastro).
function AuthLayout({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-brand-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
              <path d="m10 10.5 2 2 4-4" />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="17" cy="20" r="1.2" />
            </svg>
          </div>

          <span className="font-display text-lg font-bold">
            CompraFácil
          </span>
        </div>

        <div className="max-w-md">
          <p className="font-display text-4xl font-bold leading-tight tracking-tight xl:text-[44px]">
            Suas compras organizadas. Seu orçamento sob controle.
          </p>

          <ul className="mt-8 space-y-3">
            {VANTAGENS.map((vantagem) => (
              <li
                key={vantagem}
                className="flex items-center gap-3 text-brand-50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check size={14} aria-hidden="true" />
                </span>
                {vantagem}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-brand-100">
          © 2026 CompraFácil
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-[28px] font-bold tracking-tight">
            {titulo}
          </h1>

          <p className="mt-1.5 text-muted">
            {subtitulo}
          </p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}


export const CAMPO_AUTH =
  'mt-1.5 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100'

export const BOTAO_AUTH =
  'flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

export const ROTULO_AUTH =
  'block text-sm font-semibold text-slate-700'


// Campo de senha com botão de mostrar/ocultar.
export function CampoSenha({
  id,
  rotulo,
  valor,
  aoMudar,
  autoComplete,
  placeholder,
}: {
  id: string
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  autoComplete: string
  placeholder?: string
}) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div>
      <label htmlFor={id} className={ROTULO_AUTH}>
        {rotulo}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visivel ? 'text' : 'password'}
          value={valor}
          onChange={(event) => aoMudar(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${CAMPO_AUTH} pr-12`}
        />

        <button
          type="button"
          onClick={() => setVisivel((atual) => !atual)}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-1.5 top-[calc(50%+3px)] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-canvas hover:text-ink"
        >
          {visivel ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}


export default AuthLayout
