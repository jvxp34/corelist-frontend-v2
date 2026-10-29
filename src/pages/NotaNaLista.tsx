import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Trash2 } from 'lucide-react'

import EntradaDaNota from '../components/EntradaDaNota'
import {
  concluirComNota,
  lerNotaNaLista,
  NotaJaImportada,
  type CruzamentoDaNota,
  type ItemDaNotaNaLista,
} from '../services/nfce'
import {
  dataHoraDaNota,
  formatarMoeda,
  formatarQuantidade,
  nomeDaLoja,
  situacaoDoOrcamento,
  textoDoSaldo,
} from '../utils/formatar'


const BOTAO_PRINCIPAL =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const BOTAO_SECUNDARIO =
  'inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60'

const CAMPO =
  'h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'

const TITULO_SECAO = 'mb-2 mt-6 px-1 text-xs font-semibold uppercase tracking-wider text-muted'


// Escolha da pessoa para cada item da nota.
interface Escolha {
  listItem: number | null
  nome: string
  incluir: boolean
}


function descricaoDoPreco(item: ItemDaNotaNaLista) {
  const qtd = formatarQuantidade(item.quantidade)
  const preco = formatarMoeda(Number(item.preco))
  return item.medida === 'kg' ? `${qtd} kg × ${preco}/kg` : `${qtd} × ${preco}`
}


// Lê a nota fiscal dentro de uma lista em andamento e cruza com o planejado:
// comprados (com diferença de preço), fora da lista e esquecidos.
function NotaNaLista() {
  const { id } = useParams()
  const listId = Number(id)
  const navigate = useNavigate()

  const [link, setLink] = useState('')
  const [lendo, setLendo] = useState(false)
  const [erro, setErro] = useState('')
  const [cruzamento, setCruzamento] = useState<CruzamentoDaNota | null>(null)
  const [escolhas, setEscolhas] = useState<Record<number, Escolha>>({})
  const [concluindo, setConcluindo] = useState(false)
  const [jaImportada, setJaImportada] = useState<number | null>(null)


  async function ler(linkLido: string) {
    try {
      setLendo(true)
      setErro('')
      const resultado = await lerNotaNaLista(listId, linkLido)
      setLink(linkLido)
      setCruzamento(resultado)
      setJaImportada(resultado.lista_importada)
      setEscolhas(
        Object.fromEntries(
          resultado.itens.map((item) => [
            item.indice,
            { listItem: item.list_item, nome: item.nome, incluir: true },
          ]),
        ),
      )
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível ler a nota.')
    } finally {
      setLendo(false)
    }
  }


  function mudar(indice: number, mudanca: Partial<Escolha>) {
    setEscolhas((atuais) => ({
      ...atuais,
      [indice]: { ...atuais[indice], ...mudanca },
    }))
  }


  async function concluir() {
    if (!cruzamento) {
      return
    }
    const incluidos = cruzamento.itens.filter((item) => escolhas[item.indice]?.incluir)
    if (incluidos.length === 0) {
      setErro('Mantenha pelo menos um produto da nota.')
      return
    }
    if (incluidos.some((item) => escolhas[item.indice].nome.trim() === '')) {
      setErro('Dê um nome a todos os produtos.')
      return
    }

    try {
      setConcluindo(true)
      setErro('')
      await concluirComNota(
        listId,
        link,
        incluidos.map((item) => {
          const escolha = escolhas[item.indice]
          const nomeMudou = escolha.nome.trim() !== item.nome
          return {
            indice: item.indice,
            list_item: escolha.listItem,
            // A sugestão do catálogo só vale se a pessoa não renomeou o item.
            produto:
              escolha.listItem === null && !nomeMudou
                ? item.produto_sugerido?.id ?? null
                : null,
            nome: escolha.nome.trim(),
          }
        }),
      )
      navigate(`/listas/${listId}`)
    } catch (falha) {
      if (falha instanceof NotaJaImportada) {
        setJaImportada(falha.listId)
      } else {
        setErro(falha instanceof Error ? falha.message : 'Não foi possível concluir a lista.')
      }
    } finally {
      setConcluindo(false)
    }
  }


  const voltar = (
    <Link
      to={`/listas/${listId}`}
      className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-ink"
    >
      <ChevronLeft size={16} aria-hidden="true" />
      Voltar para a lista
    </Link>
  )


  if (!cruzamento) {
    return (
      <div className="mx-auto max-w-2xl">
        {voltar}
        <h1 className="mt-2 font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
          Concluir com a nota fiscal
        </h1>
        <p className="mt-2 text-muted">
          Leia a nota da compra: o app confere o que você planejou, o que comprou
          e quanto gastou de verdade.
        </p>
        <div className="mt-6">
          <EntradaDaNota aoLer={ler} lendo={lendo} erro={erro} aoErro={setErro} />
        </div>
      </div>
    )
  }


  const itensDaLista = new Map(cruzamento.itens_lista.map((item) => [item.id, item]))
  const incluidos = cruzamento.itens.filter((item) => escolhas[item.indice]?.incluir)
  const comprados = incluidos.filter((item) => escolhas[item.indice].listItem !== null)
  const foraDaLista = incluidos.filter((item) => escolhas[item.indice].listItem === null)
  const usados = new Set(comprados.map((item) => escolhas[item.indice].listItem))
  const esquecidos = cruzamento.itens_lista.filter((item) => !usados.has(item.id))

  const gasto = incluidos.reduce((soma, item) => soma + Number(item.total), 0)
  const planejado = comprados.reduce((soma, item) => {
    const doPlano = itensDaLista.get(escolhas[item.indice].listItem!)
    return doPlano?.preco == null
      ? soma
      : soma + Number(doPlano.preco) * Number(doPlano.quantidade)
  }, 0)
  const situacao = situacaoDoOrcamento(gasto, cruzamento.orcamento)


  function seletorDeItem(item: ItemDaNotaNaLista) {
    const atual = escolhas[item.indice].listItem
    return (
      <label className="mt-2 block text-sm text-muted">
        Na sua lista:
        <select
          value={atual ?? ''}
          onChange={(evento) =>
            mudar(item.indice, {
              listItem: evento.target.value === '' ? null : Number(evento.target.value),
            })
          }
          className={`${CAMPO} mt-1`}
        >
          <option value="">Fora da lista</option>
          {cruzamento!.itens_lista
            .filter((daLista) => daLista.id === atual || !usados.has(daLista.id))
            .map((daLista) => (
              <option key={daLista.id} value={daLista.id}>
                {daLista.nome}
              </option>
            ))}
        </select>
      </label>
    )
  }


  return (
    <div className="mx-auto max-w-2xl">
      {voltar}
      <h1 className="mt-2 font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Conferir a nota
      </h1>

      <section className="mt-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {nomeDaLoja(cruzamento.loja) || 'Loja'} · {dataHoraDaNota(cruzamento.emitida_em)}
        </p>

        <p className="mt-3 font-display text-3xl font-bold tabular-nums">
          {formatarMoeda(gasto)}
          {situacao.nivel !== 'sem' && (
            <span className="ml-2 text-base font-medium text-muted">
              de {formatarMoeda(situacao.orcamento)}
            </span>
          )}
        </p>

        {situacao.nivel !== 'sem' && (
          <>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${situacao.corBarra}`}
                style={{ width: `${Math.min(situacao.usado * 100, 100)}%` }}
              />
            </div>
            <p className={`mt-2 text-sm font-semibold ${situacao.corTexto}`}>
              {textoDoSaldo(situacao)}
            </p>
          </>
        )}

        {planejado > 0 && (
          <p className="mt-1 text-sm text-muted">
            Para os itens planejados, você esperava gastar {formatarMoeda(planejado)}.
          </p>
        )}
      </section>

      {jaImportada !== null && (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"
        >
          <p className="font-semibold">Esta nota já está no seu histórico.</p>
          <Link to={`/listas/${jaImportada}`} className={`${BOTAO_SECUNDARIO} mt-3`}>
            Ver a compra
          </Link>
        </div>
      )}

      {comprados.length > 0 && (
        <section aria-label="Comprados">
          <h2 className={TITULO_SECAO}>Comprados · {comprados.length}</h2>
          <ul className="space-y-2">
            {comprados.map((item) => {
              const doPlano = itensDaLista.get(escolhas[item.indice].listItem!)
              // Compara o preço da unidade (ou do kg): a quantidade pode ter mudado.
              const diferenca = doPlano?.preco == null
                ? null
                : Number(item.preco) - Number(doPlano.preco)
              const porQue = item.medida === 'kg' ? 'por kg' : 'por unidade'
              const qtdMudou =
                doPlano !== undefined &&
                Number(doPlano.quantidade) !== Number(item.quantidade)
              return (
                <li key={item.indice} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{doPlano?.nome}</p>
                      <p className="text-sm text-muted">
                        Na nota: {item.nome} · {descricaoDoPreco(item)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums">
                      {formatarMoeda(Number(item.total))}
                    </p>
                  </div>
                  {diferenca !== null && Math.abs(diferenca) >= 0.01 && (
                    <p className="mt-1 text-sm text-muted">
                      {diferenca > 0
                        ? `${formatarMoeda(diferenca)} ${porQue} a mais que o planejado`
                        : `${formatarMoeda(-diferenca)} ${porQue} a menos que o planejado`}
                    </p>
                  )}
                  {qtdMudou && (
                    <p className="mt-1 text-sm text-muted">
                      Planejou {formatarQuantidade(doPlano!.quantidade)}, comprou{' '}
                      {formatarQuantidade(item.quantidade)}.
                    </p>
                  )}
                  {seletorDeItem(item)}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {foraDaLista.length > 0 && (
        <section aria-label="Fora da lista">
          <h2 className={TITULO_SECAO}>Fora da lista · {foraDaLista.length}</h2>
          <ul className="space-y-2">
            {foraDaLista.map((item) => (
              <li key={item.indice} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start gap-2">
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Nome do produto</span>
                    <input
                      type="text"
                      value={escolhas[item.indice].nome}
                      onChange={(evento) => mudar(item.indice, { nome: evento.target.value })}
                      className={`${CAMPO} font-semibold`}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => mudar(item.indice, { incluir: false })}
                    aria-label={`Tirar ${item.nome} da compra`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 px-1 text-sm">
                  <span className="text-muted">
                    {descricaoDoPreco(item)}
                    {item.produto_sugerido &&
                      escolhas[item.indice].nome.trim() === item.nome && (
                        <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
                          {item.produto_sugerido.name}
                        </span>
                      )}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatarMoeda(Number(item.total))}
                  </span>
                </div>
                {cruzamento.itens_lista.length > 0 && seletorDeItem(item)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {esquecidos.length > 0 && (
        <section aria-label="Esquecidos">
          <h2 className={TITULO_SECAO}>Não vieram na nota · {esquecidos.length}</h2>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-line bg-white">
            {esquecidos.map((item) => (
              <li key={item.id} className="px-4 py-3 text-[15px]">
                {item.nome}
              </li>
            ))}
          </ul>
          <p className="mt-2 px-1 text-sm text-muted">
            Ficam na lista como "não comprado". Depois você pode passá-los para a
            próxima lista.
          </p>
        </section>
      )}

      {erro && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {erro}
        </div>
      )}

      {jaImportada === null && (
        <div className="sticky bottom-[84px] z-20 mt-6 rounded-2xl border border-line bg-white p-4 shadow-lg shadow-slate-900/5 md:bottom-6">
          <button
            type="button"
            onClick={concluir}
            disabled={concluindo}
            className={`${BOTAO_PRINCIPAL} w-full`}
          >
            {concluindo ? 'Concluindo...' : 'Concluir com a nota'}
          </button>
          <p className="mt-2 text-center text-sm text-muted">
            Os preços da nota substituem os planejados.
          </p>
        </div>
      )}
    </div>
  )
}


export default NotaNaLista
