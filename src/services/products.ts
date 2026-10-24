import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'

export type OrigemDosDados = 'manual' | 'openfoodfacts'

export interface Product {
  id: number
  name: string
  description: string
  // Preço de referência; pode não existir.
  price: number | string | null
  unit: string
  category: number | null
  brand: string
  // Embalagem, ex.: "500 g".
  package_size: string
  barcode: string
  image_url: string
  data_source: OrigemDosDados
  created_at: string
  updated_at: string
}

// Dados que o Open Food Facts devolve para um código de barras.
export interface SugestaoProduto {
  name: string
  brand: string
  package_size: string
  image_url: string
  barcode: string
  data_source: OrigemDosDados
}

export type ResultadoBusca =
  | { origem: 'catalogo'; produto: Product }
  | { origem: 'openfoodfacts'; sugestao: SugestaoProduto }

function getAuthHeaders() {
  const token = localStorage.getItem('access_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Lê a primeira mensagem de erro do DRF ({"campo": ["msg"]} ou {"detail": "msg"}).
async function mensagemDeErro(
  response: Response,
  padrao: string,
): Promise<string> {
  try {
    const dados: Record<string, string | string[]> =
      await response.json()

    const primeiro = Object.values(dados)[0]

    if (Array.isArray(primeiro)) {
      return primeiro[0] ?? padrao
    }

    return primeiro ?? padrao
  } catch {
    return padrao
  }
}

export async function listarProdutos(): Promise<Product[]> {
  const response = await apiFetch(`${API_URL}/products/`, {
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
  price: number | null
  unit: string
  category: number | null
  brand?: string
  package_size?: string
  barcode?: string
  image_url?: string
  data_source?: OrigemDosDados
}): Promise<Product> {
  const response = await apiFetch(`${API_URL}/products/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(produto),
  })

  if (!response.ok) {
    throw new Error(
      await mensagemDeErro(response, 'Não foi possível cadastrar o produto.'),
    )
  }

  return response.json()
}

// Procura no catálogo e, se não achar, no Open Food Facts (pelo backend).
export async function buscarPorCodigoDeBarras(
  codigo: string,
): Promise<ResultadoBusca> {
  const response = await apiFetch(
    `${API_URL}/products/lookup/?barcode=${encodeURIComponent(codigo)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error(
      await mensagemDeErro(
        response,
        'Não foi possível buscar o código de barras.',
      ),
    )
  }

  return response.json()
}

export async function removerProduto(id: number): Promise<void> {
  const response = await apiFetch(`${API_URL}/products/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(
      await mensagemDeErro(response, 'Não foi possível remover o produto.'),
    )
  }
}
