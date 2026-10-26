export function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}


export function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}


export function formatarQuantidade(valor: number | string) {
  return Number(valor).toLocaleString('pt-BR')
}


// Embalagem do produto ("5 kg"). Os produtos de exemplo guardam isso em
// `unit`; os cadastrados pelo código de barras, em `package_size`.
export function embalagemDoProduto(produto: {
  package_size?: string
  unit?: string
}) {
  return (produto.package_size || produto.unit || '').trim()
}


// "Camil · 5 kg": marca e embalagem, o que existir.
export function detalhesDoProduto(produto: {
  brand?: string
  package_size?: string
  unit?: string
}) {
  return [produto.brand?.trim(), embalagemDoProduto(produto)]
    .filter(Boolean)
    .join(' · ')
}


// A partir desta fração do orçamento usado, avisamos que está perto do limite.
export const LIMITE_ALERTA_ORCAMENTO = 0.9


export type NivelOrcamento =
  | 'sem'
  | 'ok'
  | 'perto'
  | 'estourou'


export interface SituacaoOrcamento {
  nivel: NivelOrcamento
  orcamento: number
  saldo: number
  usado: number
  rotulo: string
  corTexto: string
  corBarra: string
  corChip: string
}


const ESTILOS: Record<
  NivelOrcamento,
  Pick<SituacaoOrcamento, 'rotulo' | 'corTexto' | 'corBarra' | 'corChip'>
> = {
  sem: {
    rotulo: 'Sem orçamento',
    corTexto: 'text-muted',
    corBarra: 'bg-slate-300',
    corChip: 'bg-slate-100 text-slate-700',
  },
  ok: {
    rotulo: 'Dentro do orçamento',
    corTexto: 'text-green-700',
    corBarra: 'bg-green-600',
    corChip: 'bg-green-100 text-green-800',
  },
  perto: {
    rotulo: 'Perto do limite',
    corTexto: 'text-amber-700',
    corBarra: 'bg-amber-500',
    corChip: 'bg-amber-100 text-amber-800',
  },
  estourou: {
    rotulo: 'Passou do orçamento',
    corTexto: 'text-red-700',
    corBarra: 'bg-red-500',
    corChip: 'bg-red-100 text-red-800',
  },
}


export function situacaoDoOrcamento(
  total: number,
  budget: number | string | null | undefined,
): SituacaoOrcamento {
  const orcamento = Number(budget ?? 0)

  if (!(orcamento > 0)) {
    return {
      nivel: 'sem',
      orcamento: 0,
      saldo: 0,
      usado: 0,
      ...ESTILOS.sem,
    }
  }

  const saldo = orcamento - total
  const usado = total / orcamento

  const nivel: NivelOrcamento =
    saldo < 0
      ? 'estourou'
      : usado >= LIMITE_ALERTA_ORCAMENTO
        ? 'perto'
        : 'ok'

  return {
    nivel,
    orcamento,
    saldo,
    usado,
    ...ESTILOS[nivel],
  }
}


// "Restam R$ 10,00" ou "Passou R$ 5,00 do orçamento".
export function textoDoSaldo(situacao: SituacaoOrcamento) {
  return situacao.saldo < 0
    ? `Passou ${formatarMoeda(-situacao.saldo)} do orçamento`
    : `Restam ${formatarMoeda(situacao.saldo)}`
}
