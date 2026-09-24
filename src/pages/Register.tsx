import { useState } from 'react'

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import API_URL from '../api/api'

function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] =
    useState('')

  const [mostrarSenha, setMostrarSenha] =
    useState(false)

  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] =
    useState(false)

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleRegister() {
    if (
      nome.trim() === '' ||
      email.trim() === '' ||
      senha === '' ||
      confirmarSenha === ''
    ) {
      setErro('Preencha todos os campos.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (senha.length < 6) {
      setErro(
        'A senha deve ter pelo menos 6 caracteres.',
      )
      return
    }

    try {
      setCarregando(true)
      setErro('')
      setSucesso('')

      const response = await fetch(
        `${API_URL}/auth/register/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: nome.trim(),
            email: email.trim(),
            password: senha,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        if (data?.email) {
          setErro(
            Array.isArray(data.email)
              ? data.email[0]
              : 'Este e-mail já está cadastrado.',
          )
        } else {
          setErro(
            'Não foi possível criar sua conta.',
          )
        }

        return
      }

      setSucesso(
        'Conta criada com sucesso! Você será redirecionado para o login.',
      )

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.',
      )
    } finally {
      setCarregando(false)
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    handleRegister()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Painel visual */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-300/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Sparkles size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  CoreList
                </h1>

                <p className="text-sm text-blue-100">
                  Compras inteligentes
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur-sm">
              <Sparkles size={15} />
              Comece agora
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
              Organize.
              <br />
              Economize.
              <br />
              Simplifique.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-blue-50">
              Crie sua conta no CoreList e tenha um lugar
              para organizar suas compras, listas e produtos.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/15 p-2">
                  <CheckCircle2 size={17} />
                </div>

                <span className="text-sm text-blue-50">
                  Crie listas de compras
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/15 p-2">
                  <CheckCircle2 size={17} />
                </div>

                <span className="text-sm text-blue-50">
                  Cadastre seus produtos
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/15 p-2">
                  <CheckCircle2 size={17} />
                </div>

                <span className="text-sm text-blue-50">
                  Acompanhe suas compras
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-blue-100">
            © 2026 CoreList
          </div>
        </div>

        {/* Formulário */}
        <div className="flex min-h-screen items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
                <Sparkles size={21} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  CoreList
                </h1>

                <p className="text-xs text-slate-500">
                  Compras inteligentes
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Comece agora
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  Criar sua conta
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Crie sua conta para começar a organizar
                  suas compras.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Nome */}
                <div>
                  <label
                    htmlFor="nome"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Nome
                  </label>

                  <div className="relative mt-2">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(event) =>
                        setNome(event.target.value)
                      }
                      placeholder="Seu nome"
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    E-mail
                  </label>

                  <div className="relative mt-2">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label
                    htmlFor="senha"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </label>

                  <div className="relative mt-2">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="senha"
                      type={
                        mostrarSenha
                          ? 'text'
                          : 'password'
                      }
                      value={senha}
                      onChange={(event) =>
                        setSenha(event.target.value)
                      }
                      placeholder="Crie uma senha"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarSenha(
                          (valor) => !valor,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      {mostrarSenha ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar senha */}
                <div>
                  <label
                    htmlFor="confirmarSenha"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Confirmar senha
                  </label>

                  <div className="relative mt-2">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmarSenha"
                      type={
                        mostrarConfirmarSenha
                          ? 'text'
                          : 'password'
                      }
                      value={confirmarSenha}
                      onChange={(event) =>
                        setConfirmarSenha(
                          event.target.value,
                        )
                      }
                      placeholder="Digite a senha novamente"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarConfirmarSenha(
                          (valor) => !valor,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      {mostrarConfirmarSenha ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Erro */}
                {erro && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-700">
                      {erro}
                    </p>
                  </div>
                )}

                {/* Sucesso */}
                {sucesso && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-sm font-medium text-green-700">
                      {sucesso}
                    </p>
                  </div>
                )}

                {/* Botão */}
                <button
                  type="submit"
                  disabled={carregando}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {carregando
                    ? 'Criando conta...'
                    : 'Criar minha conta'}

                  {!carregando && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Já possui uma conta?
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Entrar na minha conta
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Crie sua conta e comece a organizar suas compras
              com o CoreList.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register