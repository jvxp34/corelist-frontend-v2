import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout, {
  BOTAO_AUTH,
  CAMPO_AUTH,
  CampoSenha,
  ROTULO_AUTH,
} from '../components/AuthLayout'
import { entrar } from '../services/auth'


function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (email.trim() === '' || senha === '') {
      setErro('Preencha e-mail e senha.')
      return
    }

    try {
      setCarregando(true)
      setErro('')

      await entrar(email.trim(), senha)

      navigate('/dashboard')
    } catch (error) {
      setErro((error as Error).message)
      setCarregando(false)
    }
  }


  return (
    <AuthLayout
      titulo="Entre na sua conta"
      subtitulo="Acesse suas listas e continue de onde parou."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <div>
          <label htmlFor="email" className={ROTULO_AUTH}>
            E-mail
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className={CAMPO_AUTH}
          />
        </div>

        <CampoSenha
          id="senha"
          rotulo="Senha"
          valor={senha}
          aoMudar={setSenha}
          autoComplete="current-password"
          placeholder="Sua senha"
        />

        {erro && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className={BOTAO_AUTH}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Ainda não tem conta?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:text-brand-800"
        >
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  )
}


export default Login
