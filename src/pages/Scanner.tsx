import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

import EntradaDaNota from '../components/EntradaDaNota'
import SugerirProximaLista from '../components/SugerirProximaLista'
import {
  importarNota,
  lerNota,
  NotaJaImportada,
  type ItemDaNota,
  type NotaLida,
} from '../services/nfce'
import {
  dataHoraDaNota,
  formatarMoeda,
  formatarQuantidade,
  nomeDaLoja,
} from '../utils/formatar'


const BOTAO_PRINCIPAL =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const BOTAO_SECUNDARIO =
  'inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60'

const CAMPO =
  'h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[15px] outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'


function dataDaNota(nota: NotaLida) {
  return dataHoraDaNota(nota.emitida_em)
}

function nomePadrao(nota: NotaLida) {
  const dia = nota.emitida_em
    ? new Date(nota.emitida_em).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'America/Manaus',
      })
    : ''
  return `${nomeDaLoja(nota.loja) || 'Compra'} ${dia}`.trim()
}

function descricaoDoItem(item: ItemDaNota) {
  const qtd = formatarQuantidade(item.quantidade)
  const preco = formatarMoeda(Number(item.preco))
  return item.medida === 'kg'
    ? `${qtd} kg × ${preco}/kg`
    : `${qtd} × ${preco}`
}


// Lê a nota fiscal (NFC-e) pelo QR code ou pelo link, mostra os itens para
// conferir e salva como compra concluída.
function Scanner() {

  const [link, setLink] = useState('')
  const [lendo, setLendo] = useState(false)
  const [erro, setErro] = useState('')

  const [nota, setNota] = useState<NotaLida | null>(null)
  const [itens, setItens] = useState<ItemDaNota[]>([])
  const [nomeCompra, setNomeCompra] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [jaImportada, setJaImportada] = useState<number | null>(null)
  const [compraSalva, setCompraSalva] = useState<number | null>(null)


  async function ler(texto: string) {
    const linkLido = texto.trim()
    setErro('')

    try {
      setLendo(true)
      const lida = await lerNota(linkLido)
      setLink(linkLido)
      setNota(lida)
      setItens(lida.itens)
      setNomeCompra(nomePadrao(lida))
      setJaImportada(lida.lista_importada)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível ler a nota.')
    } finally {
      setLendo(false)
    }
  }


  function recomecar() {
    setNota(null)
    setItens([])
    setLink('')
    setErro('')
    setJaImportada(null)
  }


  function mudarNome(indice: number, nome: string) {
    setItens((atuais) =>
      atuais.map((item, i) => (i === indice ? { ...item, nome } : item)),
    )
  }


  function removerItem(indice: number) {
    setItens((atuais) => atuais.filter((_, i) => i !== indice))
  }


  async function salvar() {
    if (itens.length === 0) {
      setErro('A compra precisa de pelo menos um produto.')
      return
    }
    if (itens.some((item) => item.nome.trim() === '')) {
      setErro('Dê um nome a todos os produtos.')
      return
    }

    try {
      setSalvando(true)
      setErro('')
      const lista = await importarNota(
        link,
        nomeCompra.trim(),
        itens.map((item) => ({
          nome: item.nome.trim(),
          quantidade: item.quantidade,
          medida: item.medida,
          preco: item.preco,
        })),
      )
      setCompraSalva(lista.id)
    } catch (falha) {
      if (falha instanceof NotaJaImportada) {
        setJaImportada(falha.listId)
      } else {
        setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar a compra.')
      }
    } finally {
      setSalvando(false)
    }
  }


  const total = itens.reduce((soma, item) => soma + Number(item.total), 0)

  const avisoErro = erro && (
    <div
      role="alert"
      className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
    >
      {erro}
    </div>
  )


  if (compraSalva !== null) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
          Ler nota fiscal
        </h1>
        <SugerirProximaLista compraId={compraSalva} />
      </div>
    )
  }


  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
        Ler nota fiscal
      </h1>

      {!nota && (
        <>
          <p className="mt-2 text-muted">
            Registre uma compra com os preços que você pagou, sem digitar nada.
          </p>

          <div className="mt-6">
            <EntradaDaNota aoLer={ler} lendo={lendo} erro={erro} aoErro={setErro} />
          </div>
        </>
      )}

      {nota && (
        <>
          <section className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Compra na nota
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold">
              {nomeDaLoja(nota.loja) || 'Loja'}
            </h2>
            <p className="text-sm text-muted">{dataDaNota(nota)}</p>

            <p className="mt-4 font-display text-3xl font-bold tabular-nums">
              {formatarMoeda(total)}
            </p>
            <p className="text-sm text-muted">
              {itens.length} {itens.length === 1 ? 'produto' : 'produtos'}
              {Math.abs(total - Number(nota.total)) >= 0.01 &&
                ` · total da nota: ${formatarMoeda(Number(nota.total))}`}
            </p>
          </section>

          {jaImportada !== null ? (
            <div
              role="status"
              className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"
            >
              <p className="font-semibold">Esta nota já está no seu histórico.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`/listas/${jaImportada}`} className={BOTAO_SECUNDARIO}>
                  Ver a compra
                </Link>
                <button type="button" onClick={recomecar} className={BOTAO_SECUNDARIO}>
                  Ler outra nota
                </button>
              </div>
            </div>
          ) : (
            <>
              <label className="mt-6 block text-sm font-semibold text-slate-700">
                Nome da compra
                <input
                  type="text"
                  value={nomeCompra}
                  onChange={(evento) => setNomeCompra(evento.target.value)}
                  className={`${CAMPO} mt-1.5`}
                />
              </label>

              <h2 className="mt-6 text-[15px] font-semibold">Confira os produtos</h2>
              <p className="text-sm text-muted">
                Os nomes vêm abreviados da nota. Ajuste se quiser.
              </p>

              <ul className="mt-3 space-y-2">
                {itens.map((item, indice) => (
                  <li
                    key={`${item.codigo_loja}-${indice}`}
                    className="rounded-2xl border border-line bg-white p-3 sm:p-4"
                  >
                    <div className="flex items-start gap-2">
                      <label className="min-w-0 flex-1">
                        <span className="sr-only">Nome do produto {indice + 1}</span>
                        <input
                          type="text"
                          value={item.nome}
                          onChange={(evento) => mudarNome(indice, evento.target.value)}
                          className={`${CAMPO} font-semibold`}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removerItem(indice)}
                        aria-label={`Tirar ${item.nome} da compra`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3 px-1 text-sm">
                      <span className="text-muted">
                        {descricaoDoItem(item)}
                        {item.produto && (
                          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
                            no catálogo
                          </span>
                        )}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {formatarMoeda(Number(item.total))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {avisoErro}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={salvar}
                  disabled={salvando}
                  className={BOTAO_PRINCIPAL}
                >
                  {salvando ? 'Salvando...' : 'Salvar compra'}
                </button>
                <button
                  type="button"
                  onClick={recomecar}
                  disabled={salvando}
                  className={BOTAO_SECUNDARIO}
                >
                  Cancelar
                </button>
              </div>

              <p className="mt-3 text-sm text-muted">
                A compra entra como concluída: os preços passam a valer no seu
                histórico e em "Produtos com menor preço".
              </p>
            </>
          )}
        </>
      )}

    </div>
  )
}


export default Scanner
