import { NavLink } from 'react-router-dom'

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
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/listas"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          🛒 Minhas listas
        </NavLink>

        <NavLink
          to="/produtos"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          📦 Produtos
        </NavLink>

        <NavLink
          to="/promocoes"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          🏷️ Promoções
        </NavLink>

        <NavLink
          to="/scanner"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          📷 Ler nota fiscal
        </NavLink>

        <NavLink
          to="/relatorios"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          📊 Relatórios
        </NavLink>

        <NavLink
          to="/historico"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          🕒 Histórico
        </NavLink>

        <NavLink
          to="/grupos"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          👥 Grupos
        </NavLink>

      </nav>

      <div className="mt-8 border-t pt-4">

        <NavLink
          to="/perfil"
          className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          👤 Meu perfil
        </NavLink>

        <button
          type="button"
          className="mt-2 w-full rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          🚪 Sair
        </button>

      </div>

    </aside>
  )
}

export default Sidebar