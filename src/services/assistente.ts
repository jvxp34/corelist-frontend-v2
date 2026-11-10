import API_URL from '../api/api'
import { apiFetch } from '../api/cliente'
import type { Origem } from './precos'


// Link que acompanha a resposta: lugar no Google Maps, página da internet ou
// a busca feita no Google (o Google pede que essas fontes apareçam).
export interface FonteDaResposta {
  tipo: 'maps' | 'web' | 'busca'
  titulo: string
  url: string
}

// Produto citado na resposta (foto do catálogo e o menor preço das notas).
export interface ProdutoDoChat {
  id: number
  nome: string
  embalagem: string | null
  imagem_url: string | null
  preco: string | null
  medida: 'unit' | 'kg' | null
  loja: string | null
}

// Loja citada na resposta (logo da rede, distância e rota).
export interface LojaDoChat {
  nome: string
  marca: string | null
  icone: string | null
  distancia_km: number | null
  url: string
}

// Lista que o assistente criou a pedido da pessoa.
export interface ListaCriadaPeloChat {
  id: number
  nome: string
  orcamento: string | null
  total_planejado: string
  itens: { produto: string; quantidade: string; medida: 'unit' | 'kg'; preco_planejado: string | null }[]
}

export interface MensagemDoChat {
  papel: 'usuario' | 'assistente'
  texto: string
  // Só para mostrar; o backend ignora no histórico.
  fontes?: FonteDaResposta[]
  produtos?: ProdutoDoChat[]
  lojas?: LojaDoChat[]
  listaCriada?: ListaCriadaPeloChat | null
}

export interface RespostaDoAssistente {
  resposta: string
  // IA que respondeu; 'sem_ia' = frases prontas (sem chave ou erro).
  fonte: 'gemini' | 'groq' | 'claude' | 'sem_ia'
  fontes: FonteDaResposta[]
  produtos: ProdutoDoChat[]
  lojas: LojaDoChat[]
  lista_criada?: ListaCriadaPeloChat | null
}


// POST lists/assistente/: o histórico vai inteiro (o backend corta o excesso).
export async function perguntarAoAssistente(
  mensagens: MensagemDoChat[],
  origem?: Origem | null,
): Promise<RespostaDoAssistente> {
  const corpo: Record<string, unknown> = {
    mensagens: mensagens.map(({ papel, texto }) => ({ papel, texto })),
  }
  if (origem) {
    // 3 casas (~100 m): basta para a distância.
    corpo.lat = Number(origem.lat.toFixed(3))
    corpo.lng = Number(origem.lng.toFixed(3))
  }

  const response = await apiFetch(`${API_URL}/lists/assistente/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })

  if (response.status === 429) {
    throw new Error('Você fez muitas perguntas seguidas. Tente de novo daqui a pouco.')
  }
  if (!response.ok) {
    const dados = await response.json().catch(() => null)
    throw new Error(dados?.detail ?? 'O assistente não respondeu. Tente de novo.')
  }
  return response.json()
}
