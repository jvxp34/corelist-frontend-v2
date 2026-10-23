import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout, {
  BOTAO_AUTH,
  CAMPO_AUTH,
  CampoSenha,
  ROTULO_AUTH,
} from '../components/AuthLayout'
import { cadastrar, entrar } from '../services/auth'


// Mesmo mínimo do backend (MinimumLengthValidator).
const TAMANHO_MINIMO_SENHA = 8


function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      nome.trim() === '' ||
      email.trim() === '' ||
      senha === '' ||
      confirmarSenha === ''
    ) {
      setErro('Preencha todos os campos.')
      return
    }

    if (senha.length < TAMANHO_MINIMO_SENHA) {
      setErro(
        `A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
      )
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não são iguais.')
      return
    }

    try {
      setCarregando(true)
      setErro('')

      await cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      })
    } catch (error) {
      setErro((error as Error).message)
      setCarregando(false)
      return
    }

    // Conta criada: já entra direto, sem pedir login de novo.
    try {
      await entrar(email.trim(), senha)
      navigate('/dashboard')
    } catch {
      navigate('/login')
    }
  }


  return (
    <AuthLayout
      titulo="Crie sua conta"
      subtitulo="Leva menos de um minuto."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <div>
          <label htmlFor="nome" className={ROTULO_AUTH}>
            Nome
          </label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Como quer ser chamado"
            autoComplete="given-name"
            className={CAMPO_AUTH}
          />
        </div>

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
          autoComplete="new-password"
          placeholder={`Pelo menos ${TAMANHO_MINIMO_SENHA} caracteres`}
        />

        <CampoSenha
          id="confirmar-senha"
          rotulo="Confirmar senha"
          valor={confirmarSenha}
          aoMudar={setConfirmarSenha}
          autoComplete="new-password"
          placeholder="Repita a senha"
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
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-800"
        >
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}


export default Register
