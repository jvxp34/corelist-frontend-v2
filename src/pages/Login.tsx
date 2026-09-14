import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import Button from '../components/Button'

import Input from '../components/Input'

import API_URL from '../api/api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin() {
    if (email.trim() === '' || senha === '') {
      setErro('Preencha e-mail e senha.')
      return
    }

    try {
      setCarregando(true)
      setErro('')

      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro('E-mail ou senha incorretos.')
        return
      }

      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      navigate('/dashboard')
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          CoreList 2.0
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Compras mais inteligentes
        </p>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />

          {erro && (
            <p className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <Button onClick={handleLogin}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login