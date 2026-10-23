import { useState } from 'react'
import { Package } from 'lucide-react'


const TAMANHOS = {
  sm: { caixa: 'h-11 w-11 rounded-xl', icone: 20 },
  md: { caixa: 'h-14 w-14 rounded-2xl', icone: 24 },
  lg: { caixa: 'h-24 w-24 rounded-2xl', icone: 36 },
}


// Miniatura do produto. Sem foto (ou se ela não carregar), mostra um ícone.
function FotoProduto({
  url,
  nome,
  tamanho = 'md',
}: {
  url?: string | null
  nome: string
  tamanho?: keyof typeof TAMANHOS
}) {
  // Guarda qual URL falhou: se a URL mudar, tenta de novo.
  const [urlComErro, setUrlComErro] =
    useState<string | null>(null)

  const { caixa, icone } = TAMANHOS[tamanho]
  const temFoto = Boolean(url) && url !== urlComErro

  if (!temFoto) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center bg-canvas text-slate-400 ${caixa}`}
        aria-hidden="true"
      >
        <Package size={icone} strokeWidth={1.6} />
      </span>
    )
  }

  return (
    <img
      src={url ?? undefined}
      alt={`Foto de ${nome}`}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setUrlComErro(url ?? null)}
      className={`shrink-0 border border-line bg-white object-contain p-1 ${caixa}`}
    />
  )
}


export default FotoProduto
