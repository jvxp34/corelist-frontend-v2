import { Minus, Plus } from 'lucide-react'

import { formatarQuantidade } from '../utils/formatar'

interface Props {
  id: string
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  autoFocus?: boolean
  // Embalagem do produto ("5 kg"), para mostrar "2 × 5 kg" embaixo.
  embalagem?: string
}

// Quantidade de 1 em 1 com − e +. Dá para digitar decimal (1,5 kg).
function CampoQuantidade({
  id,
  rotulo,
  valor,
  aoMudar,
  autoFocus,
  embalagem,
}: Props) {
  const numero = Number(valor.replace(',', '.'))
  const atual = Number.isFinite(numero) ? numero : 0
  const valido = valor.trim() !== '' && atual > 0

  // O que está sendo contado: "2 × 5 kg" ou "2 un.".
  let dica = ''
  if (valido) {
    const qtd = formatarQuantidade(atual)
    if (embalagem) {
      dica = `${qtd} × ${embalagem}`
    } else if (Number.isInteger(atual)) {
      dica = `${qtd} un.`
    }
  }

  function diminuir() {
    // 2,5 → 2; 2 → 1; nunca abaixo de 1.
    const proximo = Number.isInteger(atual) ? atual - 1 : Math.floor(atual)
    aoMudar(String(Math.max(1, proximo)))
  }

  function aumentar() {
    aoMudar(String(Math.floor(atual) + 1))
  }

  const botao =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {rotulo}
      </label>

      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={diminuir}
          disabled={atual <= 1}
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
