import { useState } from 'react'

import {
  User,
  Mail,
  ShieldCheck,
  Bell,
  LogOut,
  Save,
  Pencil,
} from 'lucide-react'

function Profile() {
  const [nome, setNome] = useState('João')
  const [email, setEmail] = useState('joao@email.com')

  const [notificacoes, setNotificacoes] = useState(true)

  const [salvo, setSalvo] = useState(false)

  function salvarPerfil() {
    setSalvo(true)

    setTimeout(() => {
      setSalvo(false)
    }, 2500)
  }

  function sair() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    window.location.href = '/login'
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Meu perfil
        </h1>

        <p className="mt-2 text-gray-500">
          Gerencie suas informações e preferências.
        </p>
      </div>

      {/* Perfil */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-blue-600 shadow-lg">
              {nome.charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {nome}
              </h2>

              <p className="mt-1 text-blue-100">
                Conta CoreList
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2">
            <Pencil
              size={19}
              className="text-blue-600"
            />

            <h2 className="text-xl font-bold text-gray-900">
              Informações pessoais
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="text-sm font-medium text-gray-700"
              >
                Nome
              </label>

              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                E-mail
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={salvarPerfil}
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Save size={18} />

            {salvo ? 'Alterações salvas!' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {/* Preferências */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Bell size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Notificações
            </h2>

            <p className="text-sm text-gray-500">
              Receba avisos sobre suas compras e listas.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <div>
            <p className="font-medium text-gray-900">
              Notificações ativadas
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Receber lembretes e atualizações.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setNotificacoes((valor) => !valor)
            }
            className={`relative h-7 w-12 rounded-full transition ${
              notificacoes
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
            aria-label="Alternar notificações"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                notificacoes
                  ? 'left-6'
                  : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Segurança */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Segurança
            </h2>

            <p className="text-sm text-gray-500">
              Proteja o acesso à sua conta.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Alterar senha
        </button>
      </div>

      {/* Sair */}
      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Sair da conta
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Você será desconectado deste dispositivo.
            </p>
          </div>

          <button
            type="button"
            onClick={sair}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile