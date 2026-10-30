import { useState } from 'react'

import { nomeDaLojaParaMostrar, type LojaDoPreco } from '../services/precos'


const TAMANHOS = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-10 w-10 text-sm',
}


// "A C Rodrigues Da Silva" -> "AC"; "Super Nova" -> "SN".
function iniciais(nome: string) {
  const palavras = nome
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter((palavra) => palavra.length > 0)
  return palavras.slice(0, 2).map((palavra) => palavra[0].toUpperCase()).join('')
}


// Ícone da rede (redes conhecidas, em public/lojas) ou as iniciais da loja.
function LogoDaLoja({ loja, tamanho = 'md' }: { loja: LojaDoPreco; tamanho?: keyof typeof TAMANHOS }) {
  const [falhou, setFalhou] = useState(false)
  const caixa = `${TAMANHOS[tamanho]} shrink-0 overflow-hidden rounded-full border border-line bg-white`

  if (loja.icone && !falhou) {
    return (
      <img
        src={`/lojas/${loja.icone}.png`}
        alt=""
        aria-hidden="true"
        onError={() => setFalhou(true)}
        className={`${caixa} object-contain p-0.5`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${caixa} flex items-center justify-center bg-brand-50 font-semibold text-brand-800`}
    >
      {iniciais(nomeDaLojaParaMostrar(loja))}
    </span>
  )
}


export default LogoDaLoja
