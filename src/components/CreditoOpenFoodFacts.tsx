import type { OrigemDosDados } from '../services/products'


const BASES: Partial<Record<OrigemDosDados, { nome: string; url: string }>> = {
  openfoodfacts: {
    nome: 'Open Food Facts',
    url: 'https://world.openfoodfacts.org',
  },
  openbeautyfacts: {
    nome: 'Open Beauty Facts',
    url: 'https://world.openbeautyfacts.org',
  },
  openproductsfacts: {
    nome: 'Open Products Facts',
    url: 'https://world.openproductsfacts.org',
  },
}


// Crédito exigido pelas licenças dessas bases (ODbL e CC BY-SA).
// Recebe as origens dos produtos na tela e cita só as bases usadas.
function CreditoOpenFoodFacts({
  origens,
}: {
  origens: OrigemDosDados[]
}) {
  const bases = [...new Set(origens)]
    .map((origem) => BASES[origem])
    .filter((base) => base !== undefined)

  if (bases.length === 0) {
    return null
  }

  return (
    <p className="text-xs leading-5 text-muted">
      Fotos e dados de alguns produtos:{' '}
      {bases.map((base, indice) => (
        <span key={base.url}>
          {indice > 0 && ', '}
          <a
            href={base.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-600 hover:text-brand-800"
          >
            {base.nome}
          </a>
        </span>
      ))}{' '}
      (fotos em CC BY-SA, dados em ODbL).
    </p>
  )
}


export default CreditoOpenFoodFacts
