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

export interface MensagemDoChat {
  papel: 'usuario' | 'assistente'
  texto: string
  // Só para mostrar; o backend ignora no histórico.
  fontes?: FonteDaResposta[]
}

export interface RespostaDoAssistente {
  resposta: string
  // IA que respondeu; 'sem_ia' = frases prontas (sem chave ou erro).
  fonte: 'gemini' | 'groq' | 'claude' | 'sem_ia'
  fontes: FonteDaResposta[]
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
