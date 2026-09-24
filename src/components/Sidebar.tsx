import { NavLink } from 'react-router-dom'

import {
  LayoutDashboard,
  ShoppingCart,
  List,
  History,
  BarChart3,
  Tag,
  ScanLine,
  Users,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

function Sidebar() {
  const principal = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/listas',
      label: 'Minhas listas',
      icon: List,
    },
    {
      to: '/produtos',
      label: 'Produtos',
      icon: ShoppingCart,
    },
  ]

  const explorar = [
    {
      to: '/promocoes',
      label: 'Promoções',
      icon: Tag,
    },
    {
      to: '/scanner',
      label: 'Ler nota fiscal',
      icon: ScanLine,
    },
    {
      to: '/relatorios',
      label: 'Relatórios',
      icon: BarChart3,
    },
    {
      to: '/historico',
      label: 'Histórico',
      icon: History,
    },
    {
      to: '/grupos',
      label: 'Grupos',
      icon: Users,
    },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      {/* Logo */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
            <Sparkles size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              CoreList
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Compras inteligentes
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {/* Principal */}
        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Principal
          </p>

          <div className="space-y-1">
            {principal.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive
                            ? 'bg-white/15'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRight
                          size={16}
                          className="text-white/80"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* Explorar */}
        <div className="mt-7">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Explorar
          </p>

          <div className="space-y-1">
            {explorar.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive
                            ? 'bg-white/15'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {item.label === 'Promoções' && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          NOVO
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight
                          size={16}
                          className="text-white/80"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* Dica */}
        <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Sparkles size={17} />
          </div>

          <p className="mt-3 text-sm font-bold text-slate-900">
            Dica do CoreList
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Organize sua lista antes de ir ao mercado e
            acompanhe seus gastos.
          </p>
        </div>
      </nav>

      {/* Rodapé */}
      <div className="border-t border-slate-100 p-3">
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl p-3 transition ${
              isActive
                ? 'bg-blue-50'
                : 'hover:bg-slate-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <User size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  João
                </p>

                <p className="truncate text-xs text-slate-500">
                  Minha conta
                </p>
              </div>

              <ChevronRight
                size={17}
                className="text-slate-300 transition group-hover:translate-x-0.5"
              />
            </>
          )}
        </NavLink>

        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 transition group-hover:bg-red-100">
            <LogOut size={17} />
          </div>

          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar