import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'
import type { OrigemDosDados } from './products'

export interface List {
  id: number
  name: string
  budget: number | string | null
  is_completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
  // O serializer de listas também devolve os itens e o total calculado.
  items?: ListItem[]
  total?: number | string
}

// Por unidade (2 pacotes) ou por peso (1,5 kg; o preço vira o do kg).
export type Medida = 'unit' | 'kg'

export interface ListItem {
  id: number
  list: number
  product: number
  quantity: number | string
  measure: Medida
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
  const response = await apiFetch(`${API_URL}/lists/`, {
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
  budget: number | null
}): Promise<List> {
  const response = await apiFetch(`${API_URL}/lists/`, {
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
  const response = await apiFetch(
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
    measure?: Medida
    price?: number | null
  },
): Promise<ListItem> {
  const response = await apiFetch(
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
    measure?: Medida
    price?: number | null
    is_completed?: boolean
  },
): Promise<ListItem> {
  const response = await apiFetch(
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
  const response = await apiFetch(
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

// Só funciona em listas em andamento; concluídas ficam bloqueadas no backend.
export async function atualizarLista(
  listId: number,
  dados: {
    name?: string
    budget?: number | null
  },
): Promise<List> {
  const response = await apiFetch(
    `${API_URL}/lists/${listId}/`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(dados),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao atualizar a lista')
  }

  return response.json()
}

export async function excluirLista(
  listId: number,
): Promise<void> {
  const response = await apiFetch(
    `${API_URL}/lists/${listId}/`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao excluir a lista')
  }
}

/*
 * HISTÓRICO (listas concluídas)
 */

export async function obterHistorico(): Promise<List[]> {
  const response = await apiFetch(
    `${API_URL}/lists/history/`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar histórico de compras')
  }

  return response.json()
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
  const response = await apiFetch(
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
  const response = await apiFetch(
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

/*
 * PROMOÇÕES
 * Itens de listas ativas com preço abaixo da média que o próprio
 * usuário pagou em compras concluídas.
 */

export interface Promotion {
  item_id: number
  list_id: number
  list_name: string
  quantity: number | string
  product: string
  brand: string
  package_size: string
  image_url: string
  data_source: OrigemDosDados
  current_price: number | string
  historical_average: number | string
  savings: number | string
}

export async function obterPromocoes(): Promise<Promotion[]> {
  const response = await apiFetch(
    `${API_URL}/lists/promotions/`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar promoções')
  }

  const data: {
    promotions: Promotion[]
  } = await response.json()

  return data.promotions
}

export async function concluirLista(
  listId: number,
): Promise<List> {
  const response = await apiFetch(
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
// Cria a próxima lista com os produtos de uma compra (o preço pago vira o
// preço planejado). Sem `itens`, o backend usa todos os itens comprados.
export async function repetirCompra(
  listId: number,
  dados: { nome?: string; itens?: number[] },
): Promise<List> {
  const response = await apiFetch(`${API_URL}/lists/${listId}/repetir/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    const corpo = await response.json().catch(() => null)
    throw new Error(corpo?.detail ?? 'Não foi possível criar a próxima lista.')
  }

  return response.json()
}
