import { useEffect, useState } from 'react'
import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  ChevronRight,
  LogOut,
  MoreHorizontal,
  User,
  X,
} from 'lucide-react'

import { itensDoMenu } from './navegacao'
import { sair } from '../services/auth'

// Abas fixas do celular; o resto fica em "Mais".
const ROTAS_DAS_ABAS = [
  '/dashboard',
  '/listas',
  '/scanner',
  '/promocoes',
]

const ROTA_CENTRAL = '/scanner'

const abas = ROTAS_DAS_ABAS.map(
  (rota) =>
    itensDoMenu.find((item) => item.to === rota)!,
)

const itensDoMais = [
  ...itensDoMenu.filter(
    (item) => !ROTAS_DAS_ABAS.includes(item.to),
  ),
  {
    to: '/perfil',
    label: 'Minha conta',
    labelCurto: 'Conta',
    icon: User,
  },
]


function BottomNav() {
  const [maisAberto, setMaisAberto] =
    useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const maisAtivo = itensDoMais.some((item) =>
    location.pathname.startsWith(item.to),
  )


  useEffect(() => {
    if (!maisAberto) {
      return
    }

    function aoApertarTecla(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMaisAberto(false)
      }
    }

    window.addEventListener('keydown', aoApertarTecla)

    return () =>
      window.removeEventListener(
        'keydown',
        aoApertarTecla,
      )
  }, [maisAberto])


  function sairDaConta() {
    setMaisAberto(false)
    sair()
    navigate('/login')
  }


  return (
    <>
      {maisAberto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMaisAberto(false)}
            className="absolute inset-0 bg-ink/40"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mais opções"
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-4 pb-8 pt-3 shadow-xl"
          >
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="font-display text-lg font-semibold">
                Mais
              </p>

              <button
                type="button"
                onClick={() => setMaisAberto(false)}
                aria-label="Fechar"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-muted hover:bg-canvas"
              >
                <X size={20} />
              </button>
            </div>

            {itensDoMais.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMaisAberto(false)}
                  className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-medium text-ink hover:bg-canvas"
                >
                  <Icon
                    size={20}
                    className="text-muted"
                    aria-hidden="true"
                  />
                  <span className="flex-1">
                    {item.label}
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-slate-300"
                    aria-hidden="true"
                  />
                </NavLink>
              )
            })}

            <button
              type="button"
              onClick={sairDaConta}
              className="mt-2 flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-base font-medium text-red-700 hover:bg-red-50"
            >
              <LogOut size={20} aria-hidden="true" />
              Sair da conta
            </button>
          </div>
        </div>
      )}

      <nav
        aria-label="Menu principal"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-white px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 md:hidden"
      >
        {abas.map((aba) => {
          const Icon = aba.icon
          const central = aba.to === ROTA_CENTRAL

          return (
            <NavLink
              key={aba.to}
              to={aba.to}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                  isActive ? 'text-brand-600' : 'text-muted'
                }`
              }
            >
              {central ? (
                <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                  <Icon size={22} aria-hidden="true" />
                </span>
              ) : (
                <Icon size={22} aria-hidden="true" />
              )}
              {aba.labelCurto}
            </NavLink>
          )
        })}

        <button
          type="button"
          onClick={() => setMaisAberto(true)}
          aria-expanded={maisAberto}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
            maisAtivo ? 'text-brand-600' : 'text-muted'
          }`}
        >
          <MoreHorizontal size={22} aria-hidden="true" />
          Mais
        </button>
      </nav>
    </>
  )
}

export default BottomNav
