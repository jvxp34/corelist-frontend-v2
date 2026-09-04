import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Lists from './pages/Lists'
import Products from './pages/Products'
import Promotions from './pages/Promotions'
import Scanner from './pages/Scanner'
import Reports from './pages/Reports'
import History from './pages/History'
import Groups from './pages/Groups'
import Profile from './pages/Profile'
import ListDetail from './pages/ListDetail'

import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página de Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Área principal do sistema */}
        <Route element={<MainLayout />}>

        
          <Route
          path="/listas/:id"
          element={<ListDetail />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/listas"
            element={<Lists />}
          />

          <Route
            path="/produtos"
            element={<Products />}
          />

          <Route
            path="/promocoes"
            element={<Promotions />}
          />

          <Route
            path="/scanner"
            element={<Scanner />}
          />

          <Route
            path="/relatorios"
            element={<Reports />}
          />

          <Route
            path="/historico"
            element={<History />}
          />

          <Route
            path="/grupos"
            element={<Groups />}
          />

          <Route
            path="/perfil"
            element={<Profile />}
          />

        </Route>

        {/* Qualquer rota desconhecida volta para o login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App