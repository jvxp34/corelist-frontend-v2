import API_URL from './api'


// Uma renovação por vez: se várias chamadas recebem 401 juntas, todas
// esperam o mesmo token novo.
let renovacaoEmAndamento: Promise<string | null> | null = null


async function renovarToken(): Promise<string | null> {
  const refresh = localStorage.getItem('refresh_token')

  if (!refresh) {
    return null
  }

  try {
    const response = await fetch(`${API_URL}/auth/login/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })

    if (!response.ok) {
      // Outra aba pode ter renovado antes (o refresh usado aqui deixou de
      // valer, mas o novo já está salvo): usa a sessão dela.
      if (localStorage.getItem('refresh_token') !== refresh) {
        return localStorage.getItem('access_token')
      }
      return null
    }

    const data: { access: string; refresh?: string } =
      await response.json()

    localStorage.setItem('access_token', data.access)

    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh)
    }

    return data.access
  } catch {
    return null
  }
}


function encerrarSessao() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

  if (window.location.pathname !== '/login') {
    window.location.assign('/login?expirou=1')
  }
}


function comToken(
  init: RequestInit,
  token: string | null,
): RequestInit {
  const headers = new Headers(init.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  } else {
    headers.delete('Authorization')
  }

  return { ...init, headers }
}


// fetch autenticado: manda o token atual e, se ele venceu (401), renova
// uma vez e repete a chamada. Sem como renovar, volta para o login.
export async function apiFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem('access_token')
  const response = await fetch(url, comToken(init, token))

  if (response.status !== 401) {
    return response
  }

  if (!renovacaoEmAndamento) {
    renovacaoEmAndamento = renovarToken().finally(() => {
      renovacaoEmAndamento = null
    })
  }

  const novoToken = await renovacaoEmAndamento

  if (!novoToken) {
    encerrarSessao()
    return response
  }

  const repetida = await fetch(url, comToken(init, novoToken))

  if (repetida.status === 401) {
    encerrarSessao()
  }

  return repetida
}


export function estaLogado() {
  return Boolean(localStorage.getItem('access_token'))
}
