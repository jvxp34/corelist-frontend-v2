import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import AuthLayout, { BOTAO_AUTH, CampoSenha } from '../components/AuthLayout'
import { redefinirSenha } from '../services/auth'


// Página do link do e-mail: /redefinir-senha?uid=...&token=...
function RedefinirSenha() {
  const navigate = useNavigate()
  const [parametros] = useSearchParams()
  const uid = parametros.get('uid') ?? ''
  const token = parametros.get('token') ?? ''

  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [pronto, setPronto] = useState(false)

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (senha !== confirmacao) {
      setErro('As duas senhas não são iguais.')
      return
    }
    try {
      setSalvando(true)
      setErro('')
      await redefinirSenha(uid, token, senha)
      setPronto(true)
    } catch (falha) {
      setErro((falha as Error).message)
    } finally {
      setSalvando(false)
    }
  }

  if (!uid || !token) {
    return (
      <AuthLayout titulo="Link incompleto" subtitulo="Abra o link exatamente como veio no e-mail.">
        <Link to="/esqueci-senha" className={BOTAO_AUTH}>
          Pedir um link novo
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout titulo="Criar senha nova" subtitulo="Escolha uma senha que você não usa em outros sites.">
      {pronto ? (
        <div className="space-y-5">
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            Senha alterada. Entre com a senha nova.
          </p>
          <button type="button" onClick={() => navigate('/login')} className={BOTAO_AUTH}>
            Ir para o login
          </button>
        </div>
      ) : (
        <form onSubmit={salvar} noValidate className="space-y-5">
          <CampoSenha
            id="nova-senha"
            rotulo="Senha nova"
            valor={senha}
            aoMudar={setSenha}
            autoComplete="new-password"
            placeholder="Pelo menos 8 caracteres"
          />
          <CampoSenha
            id="confirmar-senha"
            rotulo="Repita a senha nova"
            valor={confirmacao}
            aoMudar={setConfirmacao}
            autoComplete="new-password"
          />

          {erro && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {erro}
              {erro.includes('não vale mais') && (
                <>
                  {' '}
                  <Link to="/esqueci-senha" className="underline">
                    Pedir um link novo
                  </Link>
                </>
              )}
            </p>
          )}

          <button type="submit" disabled={salvando} className={BOTAO_AUTH}>
            {salvando ? 'Salvando...' : 'Salvar senha nova'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}


export default RedefinirSenha
