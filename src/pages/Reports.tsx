import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ScanLine } from 'lucide-react'

import { obterResumoListas, type ListSummary } from '../services/lists'
import { formatarMoeda } from '../utils/formatar'


const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const MESES_NO_GRAFICO = 6


// "2026-11" -> "nov/26"
function nomeDoMes(chave: string) {
  const [ano, mes] = chave.split('-')
  return `${MESES[Number(mes) - 1]}/${ano.slice(2)}`
}


// Os últimos 6 meses até hoje, com zero nos meses sem compra.
function ultimosMeses(resumo: ListSummary) {
  const porMes = new Map(resumo.monthly.map((linha) => [linha.month, Number(linha.total)]))
  const hoje = new Date()
  return Array.from({ length: MESES_NO_GRAFICO }, (_, i) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - (MESES_NO_GRAFICO - 1 - i), 1)
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
    return { chave, total: porMes.get(chave) ?? 0 }
  })
}


function Cartao({ titulo, valor, detalhe }: { titulo: string; valor: string; detalhe?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-muted">{titulo}</p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-muted">{detalhe}</p>}
    </div>
  )
}


function GraficoMensal({ meses }: { meses: { chave: string; total: number }[] }) {
  const maior = Math.max(...meses.map((mes) => mes.total), 1)
  return (
    <div className="mt-6 flex h-56 items-end gap-2 sm:gap-4" role="img" aria-label="Gastos por mês nos últimos 6 meses">
      {meses.map((mes, indice) => {
        const atual = indice === meses.length - 1
        return (
          <div key={mes.chave} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <p className="mb-1 truncate text-center text-[11px] font-semibold tabular-nums text-muted sm:text-xs">
              {mes.total > 0 ? `R$ ${Math.round(mes.total).toLocaleString('pt-BR')}` : '—'}
            </p>
            <div className="flex flex-1 items-end">
              <div
                className={`w-full rounded-t-lg ${atual ? 'bg-brand-600' : 'bg-brand-600/35'}`}
                style={{ height: `${Math.max((mes.total / maior) * 100, mes.total > 0 ? 3 : 0)}%` }}
              />
            </div>
            <p className={`mt-2 text-center text-xs ${atual ? 'font-semibold text-ink' : 'text-muted'}`}>
              {nomeDoMes(mes.chave)}
            </p>
          </div>
        )
      })}
    </div>
  )
}


function Reports() {
  const [resumo, setResumo] = useState<ListSummary | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    obterResumoListas()
      .then(setResumo)
      .catch(() => setErro('Não foi possível carregar seus gastos agora. Tente de novo em instantes.'))
  }, [])

  const cabecalho = (
    <div>
      <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Meus gastos
      </h1>
      <p className="mt-1 text-muted">
        Quanto você gastou nas compras concluídas, mês a mês. Cada nota fiscal lida entra aqui.
      </p>
    </div>
  )

  if (erro) {
    return (
      <div className="mx-auto max-w-4xl">
        {cabecalho}
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{erro}</p>
      </div>
    )
  }

  if (!resumo) {
    return (
      <div className="mx-auto max-w-4xl">
        {cabecalho}
        <p className="mt-6 text-muted">Carregando seus gastos...</p>
      </div>
    )
  }

  if (resumo.lists_count === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        {cabecalho}
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-8 text-center">
          <p className="font-display text-lg font-semibold">Nenhuma compra concluída ainda</p>
          <p className="mt-1 text-sm text-muted">
            Leia a nota fiscal da sua próxima compra: os gastos aparecem aqui sozinhos.
          </p>
          <Link
            to="/scanner"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <ScanLine size={17} aria-hidden="true" />
            Ler nota fiscal
          </Link>
        </div>
      </div>
    )
  }

  const meses = ultimosMeses(resumo)
  const esteMes = meses[meses.length - 1]
  const mesPassado = meses[meses.length - 2]
  const diferenca = esteMes.total - mesPassado.total
  const percentual = mesPassado.total > 0 ? Math.abs(diferenca / mesPassado.total) * 100 : null

  const total = Number(resumo.total)
  const categorias = [...resumo.categories]
    .map((linha) => ({ nome: linha.category, total: Number(linha.total) }))
    .filter((linha) => linha.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
  // Produtos sem categoria (muitos vêm das notas fiscais) entram juntos.
  const semCategoria = total - categorias.reduce((soma, linha) => soma + linha.total, 0)
  if (semCategoria > 0.01) {
    categorias.push({ nome: 'Sem categoria', total: semCategoria })
  }
  const maisComprados = resumo.top_products.slice(0, 5)

  return (
    <div className="mx-auto max-w-4xl">
      {cabecalho}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Cartao
          titulo={`Este mês (${nomeDoMes(esteMes.chave)})`}
          valor={formatarMoeda(esteMes.total)}
          detalhe={
            esteMes.total === 0 ? (
              'Nenhuma compra concluída neste mês ainda'
            ) : percentual === null ? (
              'Sem compras no mês passado para comparar'
            ) : (
              <span className="inline-flex items-center gap-1">
                {diferenca > 0 ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />}
                {percentual.toFixed(0)}% {diferenca > 0 ? 'a mais' : 'a menos'} que em {nomeDoMes(mesPassado.chave)}
              </span>
            )
          }
        />
        <Cartao
          titulo="Total registrado"
          valor={formatarMoeda(total)}
          detalhe={`${resumo.lists_count} ${resumo.lists_count === 1 ? 'compra concluída' : 'compras concluídas'}`}
        />
        <Cartao
          titulo="Gasto médio por compra"
          valor={formatarMoeda(Number(resumo.average_purchase))}
        />
      </div>

      <section className="mt-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Gastos por mês</h2>
        <p className="text-sm text-muted">Os últimos 6 meses. A barra escura é o mês atual.</p>
        <GraficoMensal meses={meses} />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Por categoria</h2>
          {categorias.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Os produtos das suas compras ainda não têm categoria.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {categorias.map((categoria) => {
                const parte = total > 0 ? (categoria.total / total) * 100 : 0
                return (
                  <li key={categoria.nome}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="truncate font-medium">{categoria.nome}</span>
                      <span className="shrink-0 tabular-nums">
                        {formatarMoeda(categoria.total)}
                        <span className="ml-1.5 text-xs text-muted">{parte.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${parte}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">O que você mais compra</h2>
          <ol className="mt-4 space-y-3">
            {maisComprados.map((produto, indice) => (
              <li key={produto.product} className="flex items-center gap-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                  {indice + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{produto.product}</span>
                <span className="shrink-0 tabular-nums text-muted">
                  Qtd. {Number(produto.quantity).toLocaleString('pt-BR')}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}


export default Reports
