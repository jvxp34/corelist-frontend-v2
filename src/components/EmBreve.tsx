import { Link } from 'react-router-dom'


// Tela de funcionalidade planejada, ainda não implementada.
function EmBreve({
  titulo,
  descricao,
  passos,
}: {
  titulo: string
  descricao: string
  passos: string[]
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
          {titulo}
        </h1>

        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
          Em breve
        </span>
      </div>

      <p className="mt-2 text-muted">{descricao}</p>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[15px] font-semibold">
          Como vai funcionar
        </h2>

        <ol className="mt-4 space-y-4">
          {passos.map((passo, indice) => (
            <li key={passo} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-800">
                {indice + 1}
              </span>
              <span className="pt-0.5 text-slate-700">
                {passo}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Link
        to="/listas"
        className="mt-6 inline-flex h-11 items-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas"
      >
        Voltar para minhas listas
      </Link>
    </div>
  )
}


export default EmBreve
