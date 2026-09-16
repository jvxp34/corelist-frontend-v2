import API_URL from '../api/api'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: number | null
  created_at: string
  updated_at: string
}

function getAuthHeaders() {
  const token = localStorage.getItem('access_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function listarProdutos(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar produtos')
  }

  return response.json()
}

export async function criarProduto(produto: {
  name: string
  description: string
  price: number
  category: number | null
}): Promise<Product> {
  const response = await fetch(`${API_URL}/products/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(produto),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar produto')
  }

  return response.json()
}

export async function removerProduto(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Erro ao remover produto')
  }
}