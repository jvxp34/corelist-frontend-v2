import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'

export interface Category {
  id: number
  name: string
}

export async function listarCategorias(): Promise<Category[]> {
  const token = localStorage.getItem('access_token')

  const response = await apiFetch(`${API_URL}/categories/`, {
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