import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import Logo from './Logo'
import { itensDoMenu } from './navegacao'
import { useUsuario } from '../hooks/useUsuario'
import { nomeDeExibicao, sair } from '../services/auth'

// Menu lateral do desktop. No celular, quem navega é o BottomNav.
function Sidebar() {
  const navigate = useNavigate()
  const usuario = useUsuario()
  const nome = nomeDeExibicao(usuario)

  function sairDaConta() {
    sair()
    navigate('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-white md:flex">
      <div className="px-6 pb-6 pt-7">
        <Logo />
      </div>

      <nav
        aria-label="Menu principal"
        className="flex-1 space-y-0.5 overflow-y-auto px-3"
      >
        {itensDoMenu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2.5 text-[15px] transition ${
                isActive
                  ? 'bg-brand-50 font-semibold text-brand-800'
                  : 'font-medium text-slate-600 hover:bg-canvas hover:text-ink'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl p-2.5 transition ${
              isActive ? 'bg-brand-50' : 'hover:bg-canvas'
            }`
          }
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold uppercase text-brand-600">
            {nome ? nome[0] : '?'}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">
              {nome || 'Minha conta'}
            </span>
            {nome && (
              <span className="block text-xs text-muted">
                Minha conta
              </span>
            )}
          </span>
        </NavLink>

        <button
          type="button"
          onClick={sairDaConta}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={16} aria-hidden="true" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
