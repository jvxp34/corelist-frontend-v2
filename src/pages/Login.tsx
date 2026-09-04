import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'

function Login() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleLogin() {
    if (usuario === 'admin' && senha === 'admin123') {
      setErro('')
      navigate('/dashboard')
      return
    }

    setErro('Usuário ou senha incorretos.')
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
            placeholder="Usuário"
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
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
            Entrar
          </Button>

        </div>

      </div>

    </div>
  )
}

export default Login