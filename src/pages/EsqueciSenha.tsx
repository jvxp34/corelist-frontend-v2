import { useState } from 'react'
import { Link } from 'react-router-dom'

import AuthLayout, { BOTAO_AUTH, CAMPO_AUTH, ROTULO_AUTH } from '../components/AuthLayout'
import { pedirLinkDeSenha } from '../services/auth'


// Esqueci a senha: manda um e-mail com o link para criar uma senha nova.
function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState('')

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!email.trim()) {
      setErro('Informe o e-mail da sua conta.')
      return
    }
    try {
      setEnviando(true)
      setErro('')
      setEnviado(await pedirLinkDeSenha(email.trim()))
    } catch (falha) {
      setErro((falha as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Esqueceu a senha?"
      subtitulo="Informe o e-mail da conta. Mandamos um link para você criar uma senha nova."
    >
      {enviado ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          {enviado}
        </p>
      ) : (
        <form onSubmit={enviar} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className={ROTULO_AUTH}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className={CAMPO_AUTH}
            />
          </div>

          {erro && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {erro}
            </p>
          )}

          <button type="submit" disabled={enviando} className={BOTAO_AUTH}>
            {enviando ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        Lembrou a senha?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-800">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}


export default EsqueciSenha
