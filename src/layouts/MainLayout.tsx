import { Navigate, Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import BottomNav from '../components/BottomNav'
import Logo from '../components/Logo'
import { estaLogado } from '../api/cliente'

function MainLayout() {
  // Telas internas só com login. Token vencido é renovado pelo apiFetch.
  if (!estaLogado()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Menu lateral (desktop) */}
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        {/* Cabeçalho (celular) */}
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 px-4 py-3 backdrop-blur-md md:hidden">
          <Logo tamanho="sm" />
        </header>

        {/* O espaço embaixo no celular evita que o menu inferior cubra o conteúdo. */}
        <main className="px-4 pb-28 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-10 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Menu inferior (celular) */}
      <BottomNav />
    </div>
  )
}

export default MainLayout
