import { useState } from 'react'
import { Plus, Search, Package, Trash2 } from 'lucide-react'

function Products() {
  const [busca, setBusca] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nomeProduto, setNomeProduto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [preco, setPreco] = useState('')
  const [unidade, setUnidade] = useState('')

  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Arroz',
      categoria: 'Alimentos',
      preco: 12.00,
      unidade: '5 kg',
    },
    {
      id: 2,
      nome: 'Café',
      categoria: 'Bebidas',
      preco: 18.90,
      unidade: '500 g',
    },
    {
      id: 3,
      nome: 'Detergente',
      categoria: 'Limpeza',
      preco: 3.49,
      unidade: '500 ml',
    },
    {
      id: 4,
      nome: 'Leite',
      categoria: 'Alimentos',
      preco: 5.99,
      unidade: '1 L',
    },
  ])

  function removerProduto(id: number) {
    setProdutos(
      produtos.filter((produto) => produto.id !== id)
    )
  }

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const categorias = new Set(
  produtos.map((produto) => produto.categoria)
)

  function adicionarProduto() {
  if (
    nomeProduto.trim() === '' ||
    categoria.trim() === '' ||
    preco === '' ||
    unidade.trim() === ''
  ) {
    return
  }

  const novoProduto = {
    id: Date.now(),
    nome: nomeProduto,
    categoria: categoria,
    preco: Number(preco),
    unidade: unidade,
  }

  setProdutos([...produtos, novoProduto])

  setNomeProduto('')
  setCategoria('')
  setPreco('')
  setUnidade('')
  setMostrarFormulario(false)
}

  return (
    <div className="mx-auto max-w-6xl">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Produtos
          </h1>

          <p className="mt-2 text-gray-500">
            Consulte e gerencie seus produtos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Novo produto
        </button>

      </div>

      {mostrarFormulario && (
  <div className="mt-6 rounded-2xl bg-white p-6 shadow">

    <h2 className="text-xl font-bold text-gray-900">
      Novo produto
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Cadastre um novo produto.
    </p>

    <div className="mt-5 grid gap-4 md:grid-cols-2">

      <div>
        <label className="text-sm font-medium text-gray-700">
          Nome do produto
        </label>

        <input
          type="text"
          value={nomeProduto}
          onChange={(event) => setNomeProduto(event.target.value)}
          placeholder="Ex: Arroz"
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Categoria
        </label>

        <input
          type="text"
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          placeholder="Ex: Alimentos"
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

      <div>
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
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Unidade
        </label>

        <input
          type="text"
          value={unidade}
          onChange={(event) => setUnidade(event.target.value)}
          placeholder="Ex: 5 kg"
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

    </div>

    <div className="mt-6 flex gap-3">

      <button
        type="button"
        onClick={() => {
          setMostrarFormulario(false)
          setNomeProduto('')
          setCategoria('')
          setPreco('')
          setUnidade('')
        }}
        className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
      >
        Cancelar
      </button>

      <button
        type="button"
        onClick={adicionarProduto}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Adicionar produto
      </button>

    </div>

  </div>
)}

      {/* Pesquisa */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Pesquisar produto..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-600"
          />

        </div>

      </div>

      {/* Resumo */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Package size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Produtos cadastrados
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {produtos.length}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow">

          <p className="text-sm text-gray-500">
            Produtos encontrados
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {produtosFiltrados.length}
          </p>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow">

          <p className="text-sm text-gray-500">
            Categorias
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {categorias.size}
          </p>

        </div>

      </div>

      {/* Lista de produtos */}
      <div className="mt-8">

        <h2 className="text-2xl font-bold text-gray-900">
          Seus produtos
        </h2>

        {produtosFiltrados.length === 0 ? (

          <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow">

            <Package
              size={40}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Nenhum produto encontrado
            </h3>

            <p className="mt-1 text-gray-500">
              Tente pesquisar por outro nome.
            </p>

          </div>

        ) : (

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            {produtosFiltrados.map((produto) => (

              <div
                key={produto.id}
                className="rounded-2xl bg-white p-5 shadow"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {produto.nome}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {produto.categoria}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() => removerProduto(produto.id)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    title="Remover produto"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <div className="mt-5 flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Unidade
                    </p>

                    <p className="font-medium text-gray-900">
                      {produto.unidade}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Preço
                    </p>

                    <p className="text-xl font-bold text-blue-600">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default Products