import { Navigation } from 'lucide-react'

import { linkComoChegar, type PrecosDaLista } from '../services/precos'
import { formatarMoeda, nomeDaLoja } from '../utils/formatar'


// Onde a lista inteira sai mais barata, pelos preços das notas fiscais.
// Ordem: primeiro a loja que tem mais itens com preço, depois o total.
function MelhorLoja({ precos }: { precos: PrecosDaLista }) {
  const [melhor, ...outras] = precos.melhor_loja.slice(0, 3)

  return (
    <section
      aria-label="Melhor loja para esta lista"
      className="mt-4 rounded-2xl border border-line bg-white p-4 sm:p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Melhor loja para esta lista
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold">
            {nomeDaLoja(melhor.loja.nome)}
          </p>
          <p className="text-sm text-muted">
            {formatarMoeda(Number(melhor.total))} · {melhor.itens} de{' '}
            {precos.total_itens} itens com preço
            {melhor.desatualizados > 0 &&
              ` · ${melhor.desatualizados} ${
                melhor.desatualizados === 1 ? 'preço pode ter mudado' : 'preços podem ter mudado'
              }`}
          </p>
        </div>
        <a
          href={linkComoChegar(melhor.loja)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50 px-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-100"
        >
          <Navigation size={16} aria-hidden="true" />
          Como chegar
        </a>
      </div>

      {outras.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm text-muted">
          {outras.map((loja) => (
            <li key={loja.loja.id} className="flex justify-between gap-3">
              <span className="truncate">{nomeDaLoja(loja.loja.nome)}</span>
              <span className="shrink-0 tabular-nums">
                {formatarMoeda(Number(loja.total))} · {loja.itens} de {precos.total_itens}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}


export default MelhorLoja
