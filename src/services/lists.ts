import API_URL from '../api/api'

export interface List {
  id: number
  name: string
  budget: number | string
  created_at: string
  updated_at: string
}

export interface ListItem {
  id: number
  list: number
  product: number
  quantity: number | string
  price: number | string | null
  subtotal: number | string | null
  is_completed: boolean
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

export async function listarListas(): Promise<List[]> {
  const response = await fetch(`${API_URL}/lists/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

if (!response.ok) {
  const erro = await response.text()

  throw new Error(
    `Erro ao buscar listas (${response.status}): ${erro}`,
  )
}

  return response.json()
}

export async function criarLista(lista: {
  name: string
  budget: number
}): Promise<List> {
  const response = await fetch(`${API_URL}/lists/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(lista),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar lista')
  }

  return response.json()
}

export async function listarItensDaLista(
  listId: number,
): Promise<ListItem[]> {
  const response = await fetch(`${API_URL}/lists/${listId}/items/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar itens da lista')
  }

  return response.json()
}

export async function adicionarItemNaLista(
  listId: number,
  item: {
    product: number
    quantity: number
  },
): Promise<ListItem> {
  const response = await fetch(`${API_URL}/lists/${listId}/items/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    throw new Error('Erro ao adicionar item à lista')
  }

  return response.json()
}

export async function atualizarItemDaLista(
  listId: number,
  itemId: number,
  dados: {
    quantity?: number
    price?: number
    is_completed?: boolean
  },
): Promise<ListItem> {
  const response = await fetch(
    `${API_URL}/lists/${listId}/items/${itemId}/`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(dados),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao atualizar item da lista')
  }

  return response.json()
}

export async function removerItemDaLista(
  listId: number,
  itemId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/lists/${listId}/items/${itemId}/`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao remover item da lista')
  }
}