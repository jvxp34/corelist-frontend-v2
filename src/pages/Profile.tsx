import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUsuario } from '../hooks/useUsuario'
import {
  atualizarNome,
  nomeDeExibicao,
  sair,
  type Usuario,
} from '../services/auth'


const BOTAO_PRINCIPAL =
  'inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const CAMPO =
  'mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'

const ROTULO = 'text-sm font-semibold text-slate-700'


function Profile() {
  const navigate = useNavigate()
  const usuario = useUsuario()

  function sairDaConta() {
    sair()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Minha conta
      </h1>

      {!usuario ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-8 text-center text-muted">
          Carregando seus dados...
        </div>
      ) : (
        <FormularioConta usuario={usuario} />
      )}

      <section className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">Sair da conta</h2>
          <p className="mt-0.5 text-sm text-muted">
            Você precisará entrar de novo neste aparelho.
          </p>
        </div>

        <button
          type="button"
          onClick={sairDaConta}
          className="inline-flex h-11 items-center rounded-xl border border-red-200 bg-white px-5 text-[15px] font-semibold text-red-700 transition hover:bg-red-50"
        >
          Sair
        </button>
      </section>
    </div>
  )
}


function FormularioConta({ usuario }: { usuario: Usuario }) {
  const [nome, setNome] = useState(usuario.first_name)
  const [sobrenome, setSobrenome] = useState(usuario.last_name)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const nomeExibido = nomeDeExibicao(usuario)

  const mudou =
    nome.trim() !== usuario.first_name ||
    sobrenome.trim() !== usuario.last_name


  async function salvar(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (nome.trim() === '') {
      setErro('Informe seu nome.')
      return
    }

    try {
      setSalvando(true)
      setErro('')
      setMensagem('')

      await atualizarNome({
        first_name: nome.trim(),
        last_name: sobrenome.trim(),
      })

      setMensagem('Nome atualizado.')
    } catch (error) {
      setErro((error as Error).message)
    } finally {
      setSalvando(false)
    }
  }


  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-xl font-semibold uppercase text-brand-600">
          {nomeExibido[0]}
        </span>

        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">
            {[usuario.first_name, usuario.last_name]
              .filter(Boolean)
              .join(' ') || nomeExibido}
          </p>
          <p className="truncate text-sm text-muted">
            {usuario.email}
          </p>
        </div>
      </div>

      <form
        onSubmit={salvar}
        className="mt-6 border-t border-slate-100 pt-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={ROTULO}>
            Nome
            <input
              type="text"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value)
                setMensagem('')
              }}
              autoComplete="given-name"
              className={CAMPO}
            />
          </label>

          <label className={ROTULO}>
            Sobrenome{' '}
            <span className="font-normal text-muted">opcional</span>
            <input
              type="text"
              value={sobrenome}
              onChange={(event) => {
                setSobrenome(event.target.value)
                setMensagem('')
              }}
              autoComplete="family-name"
              className={CAMPO}
            />
          </label>
        </div>

        <p className="mt-3 text-sm text-muted">
          O e-mail é usado para entrar e não pode ser alterado aqui.
        </p>

        {erro && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {erro}
          </p>
        )}

        <div className="mt-5 flex items-center gap-4">
          <button
            type="submit"
            disabled={salvando || !mudou}
            className={BOTAO_PRINCIPAL}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>

          {mensagem && (
            <p
              role="status"
              className="text-sm font-semibold text-green-700"
            >
              {mensagem}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}


export default Profile
