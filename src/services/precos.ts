import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'
import type { Medida } from './lists'


// Preços da cidade: vêm das notas fiscais importadas (só loja, preço e data;
// nunca quem comprou).

export interface LojaDoPreco {
  id: number
  nome: string
  endereco: string
}

export interface PrecoNaLoja {
  loja: LojaDoPreco
  preco: string
  medida: Medida
  data: string
  // Mais de 1 dia: o preço pode ter mudado.
  desatualizado: boolean
}

export interface ResumoDePreco {
  produto: {
    id: number
    name: string
    brand: string
    embalagem: string
    image_url: string
  }
  mais_barato_agora: PrecoNaLoja | null
  menor_no_periodo: {
    preco: string
    medida: Medida
    loja: LojaDoPreco
    data: string
    dias: number
  } | null
  lojas: PrecoNaLoja[]
}

export type Periodo = 7 | 30 | 90

export interface PrecosDaLista {
  total_itens: number
  itens: {
    item: number
    mais_barato_agora: PrecoNaLoja | null
    lojas_com_preco: number
  }[]
  melhor_loja: {
    loja: LojaDoPreco
    total: string
    itens: number
    desatualizados: number
  }[]
}


export async function buscarPrecos(
  texto: string,
  dias: Periodo,
  sinal?: AbortSignal,
): Promise<ResumoDePreco[]> {
  const parametros = new URLSearchParams({ q: texto, dias: String(dias) })
  const response = await apiFetch(`${API_URL}/lists/precos/?${parametros}`, {
    method: 'GET',
    signal: sinal,
  })

  if (!response.ok) {
    throw new Error('Não foi possível buscar os preços.')
  }

  const dados: { produtos: ResumoDePreco[] } = await response.json()
  return dados.produtos
}


export async function obterPrecosDaLista(listId: number): Promise<PrecosDaLista> {
  const response = await apiFetch(`${API_URL}/lists/${listId}/precos/`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Não foi possível buscar os preços da lista.')
  }

  return response.json()
}


// Abre o Google Maps já com a rota até a loja (no celular, o app do Maps).
export function linkComoChegar(loja: LojaDoPreco) {
  const destino = loja.endereco ? `${loja.nome}, ${loja.endereco}` : `${loja.nome}, Manaus, AM`
  const parametros = new URLSearchParams({
    api: '1',
    destination: destino,
    travelmode: 'driving',
    dir_action: 'navigate',
  })
  return `https://www.google.com/maps/dir/?${parametros}`
}
