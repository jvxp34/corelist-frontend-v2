import {
  Home,
  List,
  ShoppingBasket,
  Tag,
  ScanLine,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface ItemDeMenu {
  to: string
  label: string
  // Nome curto para o menu inferior do celular, onde há pouco espaço.
  labelCurto: string
  icon: LucideIcon
}

// Ordem do menu lateral (desktop). Relatórios e Histórico ficam fora até
// usarem dados reais da API.
export const itensDoMenu: ItemDeMenu[] = [
  { to: '/dashboard', label: 'Início', labelCurto: 'Início', icon: Home },
  { to: '/listas', label: 'Minhas listas', labelCurto: 'Listas', icon: List },
  { to: '/produtos', label: 'Produtos', labelCurto: 'Produtos', icon: ShoppingBasket },
  { to: '/promocoes', label: 'Produtos com menor preço', labelCurto: 'Menor preço', icon: Tag },
  { to: '/scanner', label: 'Ler nota fiscal', labelCurto: 'Ler nota', icon: ScanLine },
  { to: '/grupos', label: 'Grupos', labelCurto: 'Grupos', icon: Users },
]
