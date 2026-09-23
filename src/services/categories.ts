import API_URL from '../api/api'

export interface Category {
  id: number
  name: string
}

export async function listarCategorias(): Promise<Category[]> {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}/categories/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar categorias')
  }

  return response.json()
}