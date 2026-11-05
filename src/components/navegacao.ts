import {
  BarChart3,
  Home,
  List,
  ShoppingBasket,
  Tag,
  ScanLine,
  type LucideIcon,
} from 'lucide-react'

export interface ItemDeMenu {
  to: string
  label: string
  // Nome curto para o menu inferior do celular, onde há pouco espaço.
  labelCurto: string
  icon: LucideIcon
}

// Ordem do menu lateral (desktop). Histórico fica fora até usar dados reais
// da API.
export const itensDoMenu: ItemDeMenu[] = [
  { to: '/dashboard', label: 'Início', labelCurto: 'Início', icon: Home },
  { to: '/promocoes', label: 'Produtos com menor preço', labelCurto: 'Menor preço', icon: Tag },
  { to: '/scanner', label: 'Ler nota fiscal', labelCurto: 'Ler nota', icon: ScanLine },
  { to: '/relatorios', label: 'Meus gastos', labelCurto: 'Gastos', icon: BarChart3 },
  { to: '/listas', label: 'Minhas listas', labelCurto: 'Listas', icon: List },
  { to: '/produtos', label: 'Produtos', labelCurto: 'Produtos', icon: ShoppingBasket },
]
