import { useState } from 'react'

import {
  ArrowRight,
  CheckCircle2,
  Crown,
  MailPlus,
  Plus,
  ShoppingCart,
  Users,
  X,
  ListChecks,
  UserPlus,
} from 'lucide-react'

type Grupo = {
  id: number
  nome: string
  membros: number
  listas: number
  atividade: string
  atualizado: string
  proprietario: boolean
}

function Groups() {
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [nomeGrupo, setNomeGrupo] = useState('')

  const [grupoSelecionado, setGrupoSelecionado] =
    useState<Grupo | null>(null)

  const [grupoConvite, setGrupoConvite] =
    useState<Grupo | null>(null)

  const [emailConvite, setEmailConvite] = useState('')

  const [conviteEnviado, setConviteEnviado] =
    useState(false)

  const [grupos, setGrupos] = useState<Grupo[]>([
    {
      id: 1,
      nome: 'Família',
      membros: 5,
      listas: 3,
      atividade:
        'Mariana adicionou Arroz à lista Mercado',
      atualizado: 'Há 10 min',
      proprietario: true,
    },
    {
      id: 2,
      nome: 'Casa',
      membros: 3,
      listas: 2,
      atividade:
        'Você concluiu 4 itens da lista Compras',
      atualizado: 'Há 1 hora',
      proprietario: true,
    },
    {
      id: 3,
      nome: 'Churrasco',
      membros: 8,
      listas: 1,
      atividade:
        'Carlos criou uma nova lista',
      atualizado: 'Ontem',
      proprietario: false,
    },
  ])

  function criarGrupo() {
    if (nomeGrupo.trim() === '') {
      return
    }

    const novoGrupo: Grupo = {
      id: Date.now(),
      nome: nomeGrupo.trim(),
      membros: 1,
      listas: 0,
      atividade: 'Grupo criado por você',
      atualizado: 'Agora',
      proprietario: true,
    }

    setGrupos((gruposAtuais) => [
      novoGrupo,
      ...gruposAtuais,
    ])

    setNomeGrupo('')
    setMostrarFormulario(false)
  }

  function abrirConvite(grupo: Grupo) {
    setGrupoConvite(grupo)
    setEmailConvite('')
    setConviteEnviado(false)
  }

  function enviarConvite() {
    if (emailConvite.trim() === '') {
      return
    }

    setConviteEnviado(true)
  }

  function fecharConvite() {
    setGrupoConvite(null)
    setEmailConvite('')
    setConviteEnviado(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Compartilhamento
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Grupos
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Compartilhe listas de compras e organize suas
            compras com outras pessoas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Novo grupo
        </button>
      </div>

      {/* Resumo */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600">
            <Users size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Meus grupos
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {grupos.length}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Grupos disponíveis
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="w-fit rounded-xl bg-green-50 p-3 text-green-600">
            <Users size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Pessoas nos grupos
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {grupos.reduce(
              (total, grupo) => total + grupo.membros,
              0,
            )}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Participantes
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="w-fit rounded-xl bg-purple-50 p-3 text-purple-600">
            <ShoppingCart size={22} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Listas compartilhadas
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {grupos.reduce(
              (total, grupo) => total + grupo.listas,
              0,
            )}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Em todos os grupos
          </p>
        </div>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Criar novo grupo
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Crie um espaço para compartilhar suas listas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false)
                setNomeGrupo('')
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700">
              Nome do grupo
            </label>

            <input
              type="text"
              value={nomeGrupo}
              onChange={(event) =>
                setNomeGrupo(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  criarGrupo()
                }
              }}
              placeholder="Ex: Família"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600"
            />
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false)
                setNomeGrupo('')
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={criarGrupo}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Criar grupo
            </button>
          </div>
        </div>
      )}

      {/* Lista de grupos */}
      <div className="mt-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Seus grupos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Acompanhe as atividades compartilhadas.
          </p>
        </div>

        {grupos.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto w-fit rounded-full bg-blue-50 p-4 text-blue-600">
              <Users size={32} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Você ainda não possui grupos
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Crie um grupo para compartilhar listas e
              organizar suas compras com outras pessoas.
            </p>

            <button
              type="button"
              onClick={() => setMostrarFormulario(true)}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Criar meu primeiro grupo
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {grupos.map((grupo) => (
              <div
                key={grupo.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Cabeçalho do card */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
                      <Users size={22} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {grupo.nome}
                        </h3>

                        {grupo.proprietario && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                            <Crown size={12} />
                            Admin
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {grupo.membros}{' '}
                        {grupo.membros === 1
                          ? 'membro'
                          : 'membros'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setGrupoSelecionado(grupo)
                    }
                    className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                    title="Abrir grupo"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>

                {/* Estatísticas */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <ListChecks size={16} />

                      <p className="text-sm">
                        Listas
                      </p>
                    </div>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                      {grupo.listas}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users size={16} />

                      <p className="text-sm">
                        Membros
                      </p>
                    </div>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                      {grupo.membros}
                    </p>
                  </div>
                </div>

                {/* Atividade */}
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Atividade recente
                  </p>

                  <div className="mt-3 flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-500"
                    />

                    <div>
                      <p className="text-sm text-gray-700">
                        {grupo.atividade}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {grupo.atualizado}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      setGrupoSelecionado(grupo)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <ShoppingCart size={17} />
                    Ver listas
                  </button>

                  <button
                    type="button"
                    onClick={() => abrirConvite(grupo)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    <MailPlus size={17} />
                    Convidar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Banner */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-blue-600 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus size={20} />

              <h2 className="text-xl font-bold">
                Compras ficam melhores em grupo
              </h2>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Compartilhe listas, acompanhe alterações e
              organize as compras junto com sua família ou
              amigos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Criar grupo
          </button>
        </div>
      </div>

      {/* Modal do grupo */}
      {grupoSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setGrupoSelecionado(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Users size={22} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {grupoSelecionado.nome}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {grupoSelecionado.membros}{' '}
                    {grupoSelecionado.membros === 1
                      ? 'membro'
                      : 'membros'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setGrupoSelecionado(null)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Listas compartilhadas
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {grupoSelecionado.listas}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Participantes
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {grupoSelecionado.membros}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-gray-900">
                Listas do grupo
              </h3>

              {grupoSelecionado.listas === 0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-gray-300 p-6 text-center">
                  <ListChecks
                    size={28}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Nenhuma lista compartilhada ainda.
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {Array.from(
                    {
                      length: grupoSelecionado.listas,
                    },
                    (_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingCart
                            size={18}
                            className="text-blue-600"
                          />

                          <span className="font-medium text-gray-900">
                            {index === 0
                              ? 'Mercado da semana'
                              : index === 1
                                ? 'Compras da casa'
                                : 'Lista compartilhada'}
                          </span>
                        </div>

                        <ArrowRight
                          size={17}
                          className="text-gray-400"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  fecharConvite()
                  abrirConvite(grupoSelecionado)
                  setGrupoSelecionado(null)
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <MailPlus size={18} />
                Convidar membro
              </button>

              <button
                type="button"
                onClick={() =>
                  setGrupoSelecionado(null)
                }
                className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de convite */}
      {grupoConvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={fecharConvite}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Convite
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Convidar para {grupoConvite.nome}
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharConvite}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {!conviteEnviado ? (
              <>
                <div className="mt-6 rounded-xl bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <MailPlus
                      size={22}
                      className="shrink-0 text-blue-600"
                    />

                    <p className="text-sm leading-6 text-blue-800">
                      Digite o e-mail da pessoa que você
                      deseja convidar para participar deste
                      grupo.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={emailConvite}
                    onChange={(event) =>
                      setEmailConvite(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        enviarConvite()
                      }
                    }}
                    placeholder="exemplo@email.com"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600"
                  />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={fecharConvite}
                    className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={enviarConvite}
                    disabled={!emailConvite.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MailPlus size={18} />
                    Enviar convite
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={34} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Convite enviado!
                </h3>

                <p className="mt-2 text-gray-500">
                  O convite para{' '}
                  <strong>{emailConvite}</strong> foi
                  preparado com sucesso.
                </p>

                <button
                  type="button"
                  onClick={fecharConvite}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups