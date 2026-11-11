import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'
import type { Medida } from './lists'
import { nomeDaLoja } from '../utils/formatar'


// Preços da cidade: vêm das notas fiscais importadas (só loja, preço e data;
// nunca quem comprou).

export interface LojaDoPreco {
  id: number
  // Razão social da nota ("SENDAS DISTRIBUIDORA S/A").
  nome: string
  // Nome conhecido da rede ("Assaí Atacadista") e o ícone em /lojas/<icone>.png.
  marca: string | null
  icone: string | null
  endereco: string
  // Só quando a busca manda a localização; null = loja ainda sem coordenadas.
  distancia_km?: number | null
}

export function textoDistancia(km: number | null | undefined) {
  if (km === null || km === undefined) return ''
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`
}

export interface PrecoNaLoja {
  loja: LojaDoPreco
  preco: string
  medida: Medida
  data: string
  // Mais de 7 dias: o preço pode ter mudado.
  desatualizado: boolean
}

export interface ResumoDePreco {
  produto: {
    id: number
    name: string
    brand: string
    embalagem: string
    image_url: string
    // Preenchidos sozinhos para os produtos das notas.
    nome_legivel?: string
    tipo?: string
    foto_fonte?: string
    // Site de onde veio a foto achada na internet.
    foto_credito?: string
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
  // Nas opções de um tipo: R$ por kg ou por litro, para comparar tamanhos.
  preco_por?: { valor: string; unidade: 'kg' | 'L' } | null
}


// Um tipo de produto (Arroz, Café...) com quantas opções e lojas tem.
export interface TipoDeProduto {
  tipo: string
  opcoes: number
  lojas: number
  a_partir_de: { preco: string; medida: Medida } | null
  image_url: string
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


// Perto de mim: raio em km (o backend aceita 2, 5 ou 10).
export type Raio = 2 | 5 | 10

export interface Origem {
  lat: number
  lng: number
}

// Endereço aproximado da pessoa ("Rua 10 de Julho, Centro, Manaus") ou null.
export async function ondeEstou(origem: Origem): Promise<string | null> {
  const parametros = new URLSearchParams({
    lat: origem.lat.toFixed(4),
    lng: origem.lng.toFixed(4),
  })
  const response = await apiFetch(`${API_URL}/lists/onde-estou/?${parametros}`, { method: 'GET' })
  if (!response.ok) return null
  const dados: { texto: string | null } = await response.json()
  return dados.texto
}


export async function buscarPrecos(
  texto: string,
  dias: Periodo,
  sinal?: AbortSignal,
  perto?: { origem: Origem; raio: Raio | null },
): Promise<ResumoDePreco[]> {
  const parametros = new URLSearchParams({ q: texto, dias: String(dias) })
  if (perto) {
    // 3 casas (~100 m): basta para a distância e não manda a posição exata.
    parametros.set('lat', perto.origem.lat.toFixed(3))
    parametros.set('lng', perto.origem.lng.toFixed(3))
    if (perto.raio) parametros.set('raio', String(perto.raio))
  }
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


export async function listarTipos(texto: string, sinal?: AbortSignal): Promise<TipoDeProduto[]> {
  const response = await apiFetch(
    `${API_URL}/lists/precos/tipos/?${new URLSearchParams({ q: texto })}`,
    { method: 'GET', signal: sinal },
  )

  if (!response.ok) {
    throw new Error('Não foi possível buscar os tipos de produto.')
  }

  const dados: { tipos: TipoDeProduto[] } = await response.json()
  return dados.tipos
}


// As opções (marca e tamanho) de um tipo, cada uma com as lojas.
export async function buscarOpcoesDoTipo(
  tipo: string,
  dias: Periodo,
  sinal?: AbortSignal,
  perto?: { origem: Origem; raio: Raio | null },
): Promise<ResumoDePreco[]> {
  const parametros = new URLSearchParams({ tipo, dias: String(dias) })
  if (perto) {
    parametros.set('lat', perto.origem.lat.toFixed(3))
    parametros.set('lng', perto.origem.lng.toFixed(3))
    if (perto.raio) parametros.set('raio', String(perto.raio))
  }
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


// "Assaí Atacadista" quando a rede é conhecida; senão a razão social arrumada.
export function nomeDaLojaParaMostrar(loja: LojaDoPreco) {
  return loja.marca ?? nomeDaLoja(loja.nome)
}
