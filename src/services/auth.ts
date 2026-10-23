import API_URL from '../api/api'

export interface Usuario {
  id: number
  email: string
  first_name: string
  last_name: string
}

// O menu e a tela de Início pedem o usuário ao mesmo tempo; guardamos a
// mesma requisição para não chamar a API duas vezes.
let usuarioEmAndamento: Promise<Usuario> | null = null
let tokenDoUsuario: string | null = null

export function obterUsuarioAtual(): Promise<Usuario> {
  const token = localStorage.getItem('access_token')

  // Outro login (token diferente) invalida o usuário guardado.
  if (token !== tokenDoUsuario) {
    usuarioEmAndamento = null
    tokenDoUsuario = token
  }

  if (!usuarioEmAndamento) {
    usuarioEmAndamento = fetch(`${API_URL}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao buscar o usuário')
      }

      return response.json()
    })

    usuarioEmAndamento.catch(() => {
      usuarioEmAndamento = null
    })
  }

  return usuarioEmAndamento
}

// Quem mostra o usuário (menu, Início) se inscreve para saber quando ele muda.
const ouvintes = new Set<(usuario: Usuario) => void>()

export function aoMudarUsuario(
  ouvinte: (usuario: Usuario) => void,
) {
  ouvintes.add(ouvinte)
  return () => {
    ouvintes.delete(ouvinte)
  }
}


export async function atualizarNome(dados: {
  first_name: string
  last_name: string
}): Promise<Usuario> {
  const response = await fetch(`${API_URL}/auth/me/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    throw new Error('Não foi possível salvar o nome.')
  }

  const usuario: Usuario = await response.json()

  usuarioEmAndamento = Promise.resolve(usuario)
  ouvintes.forEach((ouvinte) => ouvinte(usuario))

  return usuario
}


export function nomeDeExibicao(usuario: Usuario | null): string {
  if (!usuario) {
    return ''
  }

  return (
    usuario.first_name.trim() ||
    usuario.email.split('@')[0]
  )
}

// Entra e guarda os tokens. Lança um Error com a mensagem para o usuário.
export async function entrar(email: string, senha: string) {
  let response: Response

  try {
    response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  if (!response.ok) {
    throw new Error('E-mail ou senha incorretos.')
  }

  const data: { access: string; refresh: string } =
    await response.json()

  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  usuarioEmAndamento = null
}


// Cria a conta. Lança um Error com a mensagem do backend, se houver.
export async function cadastrar(dados: {
  nome: string
  email: string
  senha: string
}) {
  let response: Response

  try {
    response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: dados.nome,
        email: dados.email,
        password: dados.senha,
      }),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  if (!response.ok) {
    const erros: Record<string, string[]> =
      await response.json().catch(() => ({}))

    const primeiro =
      erros.email?.[0] ??
      erros.password?.[0] ??
      erros.first_name?.[0]

    throw new Error(
      primeiro ?? 'Não foi possível criar sua conta.',
    )
  }
}


export function sair() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  usuarioEmAndamento = null
}
