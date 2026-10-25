import { createContext, useContext } from 'react'


export interface PedidoDeConfirmacao {
  titulo: string
  mensagem?: string
  // Texto do botão de confirmar (ex.: "Remover", "Concluir compra").
  textoConfirmar?: string
  // Ação que apaga algo: o botão de confirmar fica vermelho.
  perigoso?: boolean
}

export type Confirmar = (pedido: PedidoDeConfirmacao) => Promise<boolean>


export const ContextoConfirmacao = createContext<Confirmar | null>(null)


// Janela de confirmação do próprio app (no lugar do window.confirm).
// Uso: const confirmar = useConfirmacao()
//      if (!(await confirmar({ titulo: 'Remover?' }))) return
export function useConfirmacao(): Confirmar {
  const confirmar = useContext(ContextoConfirmacao)

  if (!confirmar) {
    throw new Error('useConfirmacao precisa do ConfirmacaoProvider.')
  }

  return confirmar
}
