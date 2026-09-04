import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <header className="border-b bg-white px-6 py-4 md:hidden">
          <h1 className="text-xl font-bold text-blue-600">
            CoreList 2.0
          </h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default MainLayout