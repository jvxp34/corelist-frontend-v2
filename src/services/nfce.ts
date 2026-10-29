import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'
import type { Medida } from './lists'


// Item da nota fiscal como a Sefaz mostra (nome abreviado, código da loja).
export interface ItemDaNota {
  nome: string
  codigo_loja: string
  unidade: string
  medida: Medida
  quantidade: string
  preco: string
  total: string
  // Produto do catálogo com o mesmo nome, se existir.
  produto: { id: number; name: string } | null
}

export interface NotaLida {
  chave: string
  loja: string
  cnpj: string
  emitida_em: string | null
  total: string
  itens: ItemDaNota[]
  // Se o usuário já importou esta nota, o id da compra.
  lista_importada: number | null
}

export interface ItemParaImportar {
  nome: string
  quantidade: string
  medida: Medida
  preco: string
}

export class NotaJaImportada extends Error {
  listId: number | null

  constructor(listId: number | null) {
    super('Esta nota já foi importada.')
    this.listId = listId
  }
}


const CABECALHOS = { 'Content-Type': 'application/json' }

async function detalheDoErro(response: Response, padrao: string) {
  try {
    const dados = await response.json()
    if (typeof dados.detail === 'string') {
      return dados.detail
    }
    const primeiro = Object.values(dados)[0]
    return Array.isArray(primeiro) ? String(primeiro[0]) : padrao
  } catch {
    return padrao
  }
}


// Só links da Sefaz-AM: evita mandar ao servidor um QR code qualquer.
// O QR code impresso usa http://; o servidor consulta sempre por https.
export function pareceLinkDeNota(texto: string) {
  return /^https?:\/\/sistemas\.sefaz\.am\.gov\.br\/nfceweb\/consultarNFCe\.jsp\?/i
    .test(texto.trim())
}


export async function lerNota(link: string): Promise<NotaLida> {
  const response = await apiFetch(`${API_URL}/lists/nfce/ler/`, {
    method: 'POST',
    headers: CABECALHOS,
    body: JSON.stringify({ link: link.trim() }),
  })

  if (!response.ok) {
    throw new Error(
      await detalheDoErro(response, 'Não foi possível ler a nota.'),
    )
  }

  return response.json()
}


export async function importarNota(
  link: string,
  nome: string,
  itens: ItemParaImportar[],
): Promise<{ id: number }> {
  const response = await apiFetch(`${API_URL}/lists/nfce/importar/`, {
    method: 'POST',
    headers: CABECALHOS,
    body: JSON.stringify({ link: link.trim(), nome, itens }),
  })

  if (response.status === 409) {
    const dados = await response.json().catch(() => ({}))
    throw new NotaJaImportada(dados.list_id ?? null)
  }

  if (!response.ok) {
    throw new Error(
      await detalheDoErro(response, 'Não foi possível salvar a compra.'),
    )
  }

  return response.json()
}


// --- Nota fiscal dentro de uma lista em andamento ------------------------

export type MotivoDoVinculo =
  | 'codigo_de_barras'
  | 'aprendido'
  | 'mesmo_nome'
  | 'nome_parecido'

export interface ItemDaNotaNaLista {
  indice: number
  nome: string
  codigo_loja: string
  medida: Medida
  quantidade: string
  preco: string
  total: string
  // Item da lista que o app ligou a este item da nota (null = fora da lista).
  list_item: number | null
  motivo: MotivoDoVinculo | null
  // Para itens fora da lista: produto do catálogo que parece ser este.
  produto_sugerido: { id: number; name: string; motivo: MotivoDoVinculo } | null
}

export interface ItemDaListaNaNota {
  id: number
  nome: string
  quantidade: string
  medida: Medida
  preco: string | null
}

export interface CruzamentoDaNota {
  chave: string
  loja: string
  endereco: string
  emitida_em: string | null
  total: string
  orcamento: string | null
  itens: ItemDaNotaNaLista[]
  itens_lista: ItemDaListaNaNota[]
  esquecidos: number[]
  lista_importada: number | null
}

export interface EscolhaDoItem {
  indice: number
  list_item: number | null
  produto: number | null
  nome: string
}


export async function lerNotaNaLista(
  listId: number,
  link: string,
): Promise<CruzamentoDaNota> {
  const response = await apiFetch(`${API_URL}/lists/${listId}/nfce/ler/`, {
    method: 'POST',
    headers: CABECALHOS,
    body: JSON.stringify({ link: link.trim() }),
  })

  if (!response.ok) {
    throw new Error(await detalheDoErro(response, 'Não foi possível ler a nota.'))
  }

  return response.json()
}


export async function concluirComNota(
  listId: number,
  link: string,
  itens: EscolhaDoItem[],
): Promise<{ id: number; esquecidos: number[] }> {
  const response = await apiFetch(`${API_URL}/lists/${listId}/nfce/concluir/`, {
    method: 'POST',
    headers: CABECALHOS,
    body: JSON.stringify({ link: link.trim(), itens }),
  })

  if (response.status === 409) {
    const dados = await response.json().catch(() => ({}))
    throw new NotaJaImportada(dados.list_id ?? null)
  }

  if (!response.ok) {
    throw new Error(await detalheDoErro(response, 'Não foi possível concluir a lista.'))
  }

  return response.json()
}
