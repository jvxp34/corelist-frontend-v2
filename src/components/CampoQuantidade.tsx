import { Minus, Plus } from 'lucide-react'

import type { Medida } from '../services/lists'
import { formatarQuantidade } from '../utils/formatar'

interface Props {
  id: string
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  autoFocus?: boolean
  // Embalagem do produto ("5 kg"), para mostrar "2 × 5 kg" embaixo.
  embalagem?: string
  medida: Medida
  aoMudarMedida: (medida: Medida) => void
}

const OPCOES: { valor: Medida; rotulo: string }[] = [
  { valor: 'unit', rotulo: 'Unidade' },
  { valor: 'kg', rotulo: 'Peso (kg)' },
]

// O banco guarda 3 casas decimais (gramas, no peso em kg).
function arredondar(valor: number) {
  return Math.round(valor * 1000) / 1000
}

function paraTexto(valor: number) {
  return String(arredondar(valor)).replace('.', ',')
}

// Quantidade de 1 em 1 com − e +. Dá para digitar decimal (1,5 kg).
function CampoQuantidade({
  id,
  rotulo,
  valor,
  aoMudar,
  autoFocus,
  embalagem,
  medida,
  aoMudarMedida,
}: Props) {
  const porPeso = medida === 'kg'
  // Unidade: de 1 em 1. Peso: de 100 g em 100 g.
  const passo = porPeso ? 0.1 : 1
  const minimo = porPeso ? 0.1 : 1

  const numero = Number(valor.replace(',', '.'))
  const atual = Number.isFinite(numero) ? numero : 0
  const valido = valor.trim() !== '' && atual > 0

  // O que está sendo contado: "2 × 5 kg", "2 un." ou "1,5 kg".
  let dica = ''
  if (valido) {
    const qtd = formatarQuantidade(atual)
    if (porPeso) {
      dica = `${qtd} kg`
    } else if (embalagem) {
      dica = `${qtd} × ${embalagem}`
    } else if (Number.isInteger(atual)) {
      dica = `${qtd} un.`
    }
  }

  // Vai para o múltiplo do passo seguinte: 2,5 → 2 (unidade); 1,25 → 1,2 (kg).
  function diminuir() {
    const proximo = Math.ceil(arredondar(atual / passo)) * passo - passo
    aoMudar(paraTexto(Math.max(minimo, proximo)))
  }

  function aumentar() {
    const proximo = Math.floor(arredondar(atual / passo)) * passo + passo
    aoMudar(paraTexto(Math.max(minimo, proximo)))
  }

  const botao =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {rotulo}
      </label>

      <div
        role="radiogroup"
        aria-label="Comprar por"
        className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1"
      >
        {OPCOES.map((opcao) => {
          const ativa = opcao.valor === medida

          return (
            <button
              key={opcao.valor}
              type="button"
              role="radio"
              aria-checked={ativa}
              onClick={() => aoMudarMedida(opcao.valor)}
              className={`h-9 rounded-lg text-sm font-semibold transition ${
                ativa
                  ? 'bg-white text-brand-700 shadow-sm ring-1 ring-line'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {opcao.rotulo}
            </button>
          )
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={diminuir}
          disabled={atual <= minimo}
          aria-label="Diminuir quantidade"
          className={botao}
        >
          <Minus size={18} aria-hidden="true" />
        </button>

        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={valor}
          onChange={(event) => aoMudar(event.target.value)}
          autoFocus={autoFocus}
          aria-describedby={dica ? `${id}-dica` : undefined}
          className="h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-2 text-center text-[15px] font-semibold tabular-nums outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />

        <button
          type="button"
          onClick={aumentar}
          aria-label="Aumentar quantidade"
          className={botao}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      {dica && (
        <p
          id={`${id}-dica`}
          className="mt-1 text-center text-sm tabular-nums text-muted"
        >
          {dica}
        </p>
      )}
    </div>
  )
}

export default CampoQuantidade
