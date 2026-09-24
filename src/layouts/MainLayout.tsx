import { Menu, Sparkles } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Área principal */}
      <div className="min-h-screen md:ml-64">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="text-lg font-bold leading-none text-slate-900">
                  CoreList
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Suas compras, organizadas.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
              aria-label="Abrir menu"
            >
              <Menu size={21} />
            </button>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="min-h-[calc(100vh-65px)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout