import { useParams } from 'react-router-dom'
import { useState } from 'react'

function ListDetail() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nomeProduto, setNomeProduto] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [preco, setPreco] = useState('')
  const { id } = useParams()

  const listas = [
    {
      id: 1,
      nome: 'Mercado da semana',
      produtos: 8,
      valor: 142.80,
    },
    {
      id: 2,
      nome: 'Compras de casa',
      produtos: 15,
      valor: 320.40,
    },
  ]

  const [produtos, setProdutos] = useState([
  {
    id: 1,
    nome: 'Arroz',
    quantidade: 2,
    preco: 12.00,
  },
  {
    id: 2,
    nome: 'Café',
    quantidade: 1,
    preco: 18.90,
  },
])

function adicionarProduto() {
  if (nomeProduto.trim() === '' || preco === '') {
    return
  }

  const novoProduto = {
    id: Date.now(),
    nome: nomeProduto,
    quantidade: quantidade,
    preco: Number(preco),
  }

  setProdutos([...produtos, novoProduto])

  setNomeProduto('')
  setQuantidade(1)
  setPreco('')
  setMostrarFormulario(false)
}

  

  const lista = listas.find(
    (item) => item.id === Number(id)
  )

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

  const quantidadeProdutos = produtos.reduce(
  (total, produto) => total + produto.quantidade,
  0
)

const valorTotal = produtos.reduce(
  (total, produto) => total + produto.quantidade * produto.preco,
  0
)

  return (
    <div className="mx-auto max-w-6xl">

      <div className="rounded-2xl bg-white p-6 shadow">

        <h1 className="text-3xl font-bold text-gray-900">
          🛒 {lista.nome}
        </h1>

        <p className="mt-2 text-gray-500">
          Confira os produtos e informações da sua lista.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

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

        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Adicionar produto
        </button>

        {mostrarFormulario && (
  <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">

    <h2 className="text-xl font-bold text-gray-900">
      Adicionar produto
    </h2>

    <div className="mt-4">
      <label className="text-sm font-medium text-gray-700">
        Nome do produto
      </label>

      <input
        type="text"
        value={nomeProduto}
        onChange={(event) => setNomeProduto(event.target.value)}
        placeholder="Ex: Arroz"
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
      />
    </div>

    <div className="mt-4">
      <label className="text-sm font-medium text-gray-700">
        Quantidade
      </label>

      <input
        type="number"
        min="1"
        value={quantidade}
        onChange={(event) => setQuantidade(Number(event.target.value))}
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
        onChange={(event) => setPreco(event.target.value)}
        placeholder="Ex: 12.90"
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
      />
    </div>

    <div className="mt-6 flex gap-3">

      <button
        type="button"
        onClick={() => {
          setMostrarFormulario(false)
          setNomeProduto('')
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
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Adicionar
      </button>

    </div>

  </div>
)}

<div className="mt-8">

  <h2 className="text-2xl font-bold text-gray-900">
    Produtos da lista
  </h2>

  <div className="mt-4 space-y-3">

    {produtos.map((produto) => (
      <div
        key={produto.id}
        className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
      >

        <div>
          <h3 className="font-semibold text-gray-900">
            {produto.nome}
          </h3>

          <p className="text-sm text-gray-500">
            Quantidade: {produto.quantidade}
          </p>
        </div>

        <p className="font-bold text-gray-900">
          R$ {produto.preco.toFixed(2)}
        </p>

      </div>
    ))}

  </div>

</div>

      </div>

    </div>
  )
}


export default ListDetail