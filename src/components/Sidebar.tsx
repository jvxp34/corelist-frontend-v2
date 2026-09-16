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
} from 'lucide-react'

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white p-4 md:block">

      <div className="mb-8 px-3">
        <h1 className="text-2xl font-bold text-blue-600">
          CoreList
        </h1>

        <p className="text-sm text-gray-500">
          Compras inteligentes
        </p>
      </div>

      <nav className="space-y-2">

        <NavLink
          to="/dashboard"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </NavLink>

        <NavLink
          to="/listas"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <List size={18} />
            <span>Minhas listas</span>
          </div>
        </NavLink>

        <NavLink
          to="/produtos"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart size={18} />
            <span>Produtos</span>
          </div>
        </NavLink>

        <NavLink
          to="/promocoes"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <Tag size={18} />
            <span>Promoções</span>
          </div>
        </NavLink>

        <NavLink
          to="/scanner"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <ScanLine size={18} />
            <span>Ler nota fiscal</span>
          </div>
        </NavLink>

        <NavLink
          to="/relatorios"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={18} />
            <span>Relatórios</span>
          </div>
        </NavLink>

        <NavLink
          to="/historico"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <History size={18} />
            <span>Histórico</span>
          </div>
        </NavLink>

        <NavLink
          to="/grupos"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <Users size={18} />
            <span>Grupos</span>
          </div>
        </NavLink>

      </nav>

      <div className="mt-8 border-t pt-4">

        <NavLink
          to="/perfil"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <div className="flex items-center gap-3">
            <User size={18} />
            <span>Meu perfil</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="mt-2 w-full rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span>Sair</span>
          </div>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar