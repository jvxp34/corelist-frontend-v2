import API_URL from '../api/api'

export interface List {
  id: number
  name: string
  budget: number | string
  is_completed: boolean
  completed_at: string | null
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
  const response = await fetch(
    `${API_URL}/lists/${listId}/items/`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

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
  const response = await fetch(
    `${API_URL}/lists/${listId}/items/`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    },
  )

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

/*
 * RESUMO DAS LISTAS
 */

export interface ListSummaryMonthly {
  month: string
  total: number | string
}

export interface ListSummaryCategory {
  category: string
  total: number | string
}

export interface ListSummaryTopProduct {
  product: string
  quantity: number | string
}

export interface ListSummaryPeriodComparison {
  previous_month: string
  previous_total: number | string
  current_month: string
  current_total: number | string
  difference: number | string
  percentage_change: number | string
}

export interface ListSummary {
  total: number | string
  lists_count: number
  average_purchase: number | string
  monthly: ListSummaryMonthly[]
  categories: ListSummaryCategory[]
  top_products: ListSummaryTopProduct[]
  period_comparison: ListSummaryPeriodComparison
}

export async function obterResumoListas(): Promise<ListSummary> {
  const response = await fetch(
    `${API_URL}/lists/summary/`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar resumo das listas')
  }

  return response.json()
}

/*
 * INSIGHTS
 */

export interface ListInsight {
  type: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
}

export async function obterInsights(): Promise<ListInsight[]> {
  const response = await fetch(
    `${API_URL}/lists/insights/`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar insights')
  }

  const data: {
    insights: ListInsight[]
  } = await response.json()

  return data.insights
}

export async function concluirLista(
  listId: number,
): Promise<List> {
  const response = await fetch(
    `${API_URL}/lists/${listId}/complete/`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    const erro = await response.text()

    throw new Error(
      `Erro ao concluir lista (${response.status}): ${erro}`,
    )
  }

  return response.json()
}