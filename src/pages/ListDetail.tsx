import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  Trash2,
  Plus,
  CheckCircle,
  Pencil,
} from 'lucide-react'

import {
  listarListas,
  listarItensDaLista,
  adicionarItemNaLista,
  atualizarItemDaLista,
  removerItemDaLista,
  concluirLista,
  type List,
  type ListItem,
} from '../services/lists'

import {
  listarProdutos,
  type Product,
} from '../services/products'


function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const listId = Number(id)

  const [lista, setLista] =
    useState<List | null>(null)

  const [produtos, setProdutos] =
    useState<Product[]>([])

  const [itens, setItens] =
    useState<ListItem[]>([])

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [editandoLista, setEditandoLista] =
    useState(false)

  const [produtoSelecionado, setProdutoSelecionado] =
    useState('')

  const [quantidade, setQuantidade] =
    useState(1)

  const [preco, setPreco] =
    useState('')

  const [carregando, setCarregando] =
    useState(true)

  const [salvando, setSalvando] =
    useState(false)

  const [concluindo, setConcluindo] =
    useState(false)

  const [erro, setErro] =
    useState('')


  async function carregarDados() {
    try {
      setCarregando(true)
      setErro('')

      const [
        listas,
        produtosData,
        itensData,
      ] = await Promise.all([
        listarListas(),
        listarProdutos(),
        listarItensDaLista(listId),
      ])

      const listaEncontrada =
        listas.find(
          (item) => item.id === listId,
        ) ?? null

      setLista(listaEncontrada)
      setProdutos(produtosData)
      setItens(itensData)

      if (!listaEncontrada?.is_completed) {
        setEditandoLista(false)
      }

      setMostrarFormulario(false)
    } catch {
      setErro(
        'Não foi possível carregar os dados da lista.',
      )
    } finally {
      setCarregando(false)
    }
  }


  useEffect(() => {
    if (!Number.isNaN(listId)) {
      carregarDados()
    }
  }, [listId])


  async function adicionarProduto() {
    if (
      lista?.is_completed &&
      !editandoLista
    ) {
      return
    }

    if (
      !produtoSelecionado ||
      quantidade <= 0
    ) {
      return
    }

    try {
      setSalvando(true)
      setErro('')

      const novoItem =
        await adicionarItemNaLista(
          listId,
          {
            product: Number(
              produtoSelecionado,
            ),
            quantity: quantidade,
          },
        )

      let itemFinal = novoItem

      if (preco !== '') {
        itemFinal =
          await atualizarItemDaLista(
            listId,
            novoItem.id,
            {
              price: Number(preco),
            },
          )
      }

      setItens((itensAtuais) => [
        ...itensAtuais,
        itemFinal,
      ])

      setProdutoSelecionado('')
      setQuantidade(1)
      setPreco('')
      setMostrarFormulario(false)
    } catch {
      setErro(
        'Não foi possível adicionar o produto à lista.',
      )
    } finally {
      setSalvando(false)
    }
  }


  async function alternarProduto(
    item: ListItem,
  ) {
    if (
      lista?.is_completed &&
      !editandoLista
    ) {
      return
    }

    try {
      setErro('')

      const itemAtualizado =
        await atualizarItemDaLista(
          listId,
          item.id,
          {
            is_completed:
              !item.is_completed,
          },
        )

      setItens((itensAtuais) =>
        itensAtuais.map(
          (itemAtual) =>
            itemAtual.id === item.id
              ? itemAtualizado
              : itemAtual,
        ),
      )
    } catch {
      setErro(
        'Não foi possível atualizar o status do produto.',
      )
    }
  }


  async function removerProduto(
    itemId: number,
  ) {
    if (
      lista?.is_completed &&
      !editandoLista
    ) {
      return
    }

    try {
      setErro('')

      await removerItemDaLista(
        listId,
        itemId,
      )

      setItens((itensAtuais) =>
        itensAtuais.filter(
          (item) => item.id !== itemId,
        ),
      )
    } catch {
      setErro(
        'Não foi possível remover o produto da lista.',
      )
    }
  }


  async function finalizarCompra() {
    if (lista?.is_completed) {
      return
    }

    if (itens.length === 0) {
      setErro(
        'Adicione pelo menos um produto antes de concluir a compra.',
      )
      return
    }

    if (
      produtosComprados !== itens.length
    ) {
      setErro(
        'Marque todos os produtos como comprados antes de concluir a lista.',
      )
      return
    }

    const confirmou =
      window.confirm(
        'Deseja concluir esta compra? Depois disso, ela será enviada para o histórico.',
      )

    if (!confirmou) {
      return
    }

    try {
      setConcluindo(true)
      setErro('')

      await concluirLista(listId)

      navigate('/listas')
    } catch {
      setErro(
        'Não foi possível concluir a compra.',
      )
    } finally {
      setConcluindo(false)
    }
  }


  function entrarModoEdicao() {
    setEditandoLista(true)
    setErro('')
  }


  function finalizarEdicao() {
    if (itens.length === 0) {
      setErro(
        'Adicione pelo menos um produto antes de finalizar a edição.',
      )
      return
    }

    if (!todosProdutosComprados) {
      setErro(
        'Marque todos os produtos como comprados antes de finalizar a edição.',
      )
      return
    }

    setEditandoLista(false)
    setMostrarFormulario(false)
    setProdutoSelecionado('')
    setQuantidade(1)
    setPreco('')
    setErro('')
  }


  function obterProduto(
    productId: number,
  ) {
    return produtos.find(
      (produto) =>
        produto.id === productId,
    )
  }


  if (carregando) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            Carregando lista...
          </p>
        </div>
      </div>
    )
  }


  if (!lista) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Lista não encontrada
        </h1>

        <p className="mt-2 text-gray-500">
          A lista que você tentou acessar não existe.
        </p>
      </div>
    )
  }


  const quantidadeProdutos =
    itens.length


  const valorTotal = itens.reduce(
    (total, item) =>
      total +
      Number(item.subtotal ?? 0),
    0,
  )


  const produtosComprados =
    itens.filter(
      (item) => item.is_completed,
    ).length


  const progresso =
    itens.length === 0
      ? 0
      : Math.round(
          (produtosComprados /
            itens.length) *
            100,
        )


  const todosProdutosComprados =
    itens.length > 0 &&
    produtosComprados === itens.length


  const podeFinalizarEdicao =
    itens.length > 0 &&
    todosProdutosComprados


  const modoEdicao =
    !lista.is_completed ||
    editandoLista


  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🛒 {lista.name}
            </h1>

            <p className="mt-2 text-gray-500">
              Confira os produtos e informações da sua lista.
            </p>
          </div>


          {lista.is_completed &&
            !editandoLista && (
              <button
                type="button"
                onClick={entrarModoEdicao}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Pencil size={18} />
                Editar lista
              </button>
            )}

        </div>


        {erro && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {erro}
          </div>
        )}


        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Produtos
            </p>

            <p className="mt-1 text-2xl font-bold">
              {quantidadeProdutos}
            </p>
          </div>


          <div className="rounded-xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Valor estimado
            </p>

            <p className="mt-1 text-2xl font-bold">
              R$ {valorTotal.toFixed(2)}
            </p>
          </div>


          <div className="rounded-xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Orçamento
            </p>

            <p className="mt-1 text-2xl font-bold">
              R${' '}
              {Number(
                lista.budget,
              ).toFixed(2)}
            </p>
          </div>

        </div>


        <div className="mt-6 rounded-xl bg-gray-100 p-5">

          <div className="flex items-center justify-between">

            <p className="font-semibold text-gray-900">
              Progresso da compra
            </p>

            <p className="font-bold text-blue-600">
              {progresso}%
            </p>

          </div>


          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${progresso}%`,
              }}
            />

          </div>


          <p className="mt-2 text-sm text-gray-500">
            {produtosComprados} de{' '}
            {itens.length}{' '}
            produtos comprados
          </p>

        </div>


        {modoEdicao ? (
          <>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  setMostrarFormulario(true)
                }
                disabled={concluindo}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />
                Adicionar produto
              </button>


              {!lista.is_completed && (
                <button
                  type="button"
                  onClick={finalizarCompra}
                  disabled={
                    !todosProdutosComprados ||
                    concluindo
                  }
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle size={18} />

                  {concluindo
                    ? 'Concluindo...'
                    : 'Concluir compra'}
                </button>
              )}


              {lista.is_completed &&
                editandoLista && (
                  <button
                    type="button"
                    onClick={finalizarEdicao}
                    disabled={
                      salvando ||
                      !podeFinalizarEdicao
                    }
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Finalizar edição
                  </button>
                )}

            </div>


            {!lista.is_completed &&
              !todosProdutosComprados &&
              itens.length > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  Marque todos os produtos como
                  comprados para concluir a lista.
                </p>
              )}


            {lista.is_completed &&
              editandoLista &&
              itens.length === 0 && (
                <p className="mt-3 text-sm text-amber-600">
                  Adicione pelo menos um produto
                  antes de finalizar a edição.
                </p>
              )}


            {lista.is_completed &&
              editandoLista &&
              itens.length > 0 &&
              !todosProdutosComprados && (
                <p className="mt-3 text-sm text-amber-600">
                  Marque todos os produtos como
                  comprados para finalizar a edição.
                </p>
              )}


            {mostrarFormulario && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Adicionar produto
                </h2>


                <div className="mt-4">

                  <label className="text-sm font-medium text-gray-700">
                    Produto
                  </label>

                  <select
                    value={produtoSelecionado}
                    onChange={(event) =>
                      setProdutoSelecionado(
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
                  >

                    <option value="">
                      Selecione um produto
                    </option>

                    {produtos.map(
                      (produto) => (
                        <option
                          key={produto.id}
                          value={produto.id}
                        >
                          {produto.name}
                        </option>
                      ),
                    )}

                  </select>

                </div>


                <div className="mt-4">

                  <label className="text-sm font-medium text-gray-700">
                    Quantidade
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(event) =>
                      setQuantidade(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
                  />

                </div>


                <div className="mt-4">

                  <label className="text-sm font-medium text-gray-700">
                    Preço
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={preco}
                    onChange={(event) =>
                      setPreco(
                        event.target.value,
                      )
                    }
                    placeholder="Ex: 12.90"
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
                  />

                </div>


                <div className="mt-6 flex gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormulario(false)
                      setProdutoSelecionado('')
                      setQuantidade(1)
                      setPreco('')
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50"
                  >
                    Cancelar
                  </button>


                  <button
                    type="button"
                    onClick={adicionarProduto}
                    disabled={salvando}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {salvando
                      ? 'Adicionando...'
                      : 'Adicionar'}
                  </button>

                </div>

              </div>
            )}

          </>
        ) : (

          lista.is_completed &&
          itens.length > 0 && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">

              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle size={18} />
                Compra concluída
              </div>


              {lista.completed_at && (
                <p className="mt-1 text-sm text-green-600">
                  Concluída em{' '}
                  {new Date(
                    lista.completed_at,
                  ).toLocaleDateString('pt-BR')}
                </p>
              )}

            </div>
          )

        )}


        {lista.is_completed &&
          itens.length === 0 &&
          !editandoLista && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">

              <div className="flex items-center gap-2 font-semibold">
                <Pencil size={18} />
                Lista sem produtos
              </div>

              <p className="mt-1 text-sm">
                Esta lista foi concluída, mas não possui
                produtos no momento. Clique em
                "Editar lista" para adicionar produtos.
              </p>

            </div>
          )}


        <div className="mt-8">

          <h2 className="text-2xl font-bold text-gray-900">
            Produtos da lista
          </h2>


          {itens.length === 0 ? (

            <div className="mt-4 rounded-xl bg-gray-50 p-6 text-center">

              <p className="text-gray-500">
                Nenhum produto foi adicionado a esta
                lista.
              </p>

            </div>

          ) : (

            <div className="mt-4 space-y-3">

              {itens.map((item) => {

                const produto =
                  obterProduto(
                    item.product,
                  )


                return (

                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
                  >

                    <div className="flex items-center gap-4">

                      <input
                        type="checkbox"
                        checked={
                          item.is_completed
                        }
                        onChange={() =>
                          alternarProduto(
                            item,
                          )
                        }
                        disabled={
                          !modoEdicao ||
                          concluindo
                        }
                        className="h-5 w-5"
                      />


                      <div>

                        <h3
                          className={`font-semibold ${
                            item.is_completed
                              ? 'text-gray-400 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {produto?.name ??
                            `Produto #${item.product}`}
                        </h3>


                        <p className="text-sm text-gray-500">
                          Quantidade:{' '}
                          {Number(
                            item.quantity,
                          ).toLocaleString(
                            'pt-BR',
                          )}
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-4">

                      <div className="text-right">

                        <p className="font-bold text-gray-900">
                          R${' '}
                          {Number(
                            item.subtotal ?? 0,
                          ).toFixed(2)}
                        </p>


                        {item.price !== null && (
                          <p className="text-xs text-gray-500">
                            R${' '}
                            {Number(
                              item.price,
                            ).toFixed(2)}{' '}
                            / un.
                          </p>
                        )}

                      </div>


                      {modoEdicao && (
                        <button
                          type="button"
                          onClick={() =>
                            removerProduto(
                              item.id,
                            )
                          }
                          disabled={concluindo}
                          className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remover produto"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                    </div>

                  </div>

                )
              })}

            </div>

          )}

        </div>

      </div>
    </div>
  )
}


export default ListDetail