import { useEffect, useState } from 'react'

import {
  listarProdutos,
  criarProduto,
  removerProduto,
  type Product,
} from '../services/products'

import {
  listarCategorias,
  type Category,
} from '../services/categories'

import { Plus, Search, Package, Trash2 } from 'lucide-react'

function Products() {
  const [busca, setBusca] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [nomeProduto, setNomeProduto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [preco, setPreco] = useState('')
  const [unidade, setUnidade] = useState('')

  const [produtos, setProdutos] = useState<Product[]>([])
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Category[]>([])

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true)
        setErro('')

        const [produtosData, categoriasData] = await Promise.all([
          listarProdutos(),
          listarCategorias(),
        ])

        setProdutos(produtosData)
        setCategoriasDisponiveis(categoriasData)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os produtos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(busca.toLowerCase())
  )

  const categoriasUsadas = new Set(
    produtos
      .map((produto) => produto.category)
      .filter((category): category is number => category !== null)
  )

  async function handleRemoverProduto(id: number) {
    try {
      setErro('')

      await removerProduto(id)

      setProdutos((produtosAtuais) =>
        produtosAtuais.filter((produto) => produto.id !== id)
      )
    } catch (error) {
      console.error(error)
      setErro('Não foi possível remover o produto.')
    }
  }

  async function adicionarProduto() {
    if (
      nomeProduto.trim() === '' ||
      categoria === '' ||
      preco === '' ||
      unidade.trim() === ''
    ) {
      setErro('Preencha todos os campos do produto.')
      return
    }

    const precoNumerico = Number(preco)
    const categoriaId = Number(categoria)

    if (Number.isNaN(precoNumerico) || Number.isNaN(categoriaId)) {
      setErro('Preço ou categoria inválidos.')
      return
    }

    try {
      setSalvando(true)
      setErro('')

      const novoProduto = await criarProduto({
        name: nomeProduto.trim(),
        description: '',
        price: precoNumerico,
        unit: unidade.trim(),
        category: categoriaId,
      })

      setProdutos((produtosAtuais) => [
        ...produtosAtuais,
        novoProduto,
      ])

      setNomeProduto('')
      setCategoria('')
      setPreco('')
      setUnidade('')
      setMostrarFormulario(false)
    } catch (error) {
      console.error(error)
      setErro('Não foi possível criar o produto.')
    } finally {
      setSalvando(false)
    }
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setNomeProduto('')
    setCategoria('')
    setPreco('')
    setUnidade('')
    setErro('')
  }

  function obterNomeCategoria(categoryId: number | null) {
    if (categoryId === null) {
      return 'Sem categoria'
    }

    const categoriaEncontrada = categoriasDisponiveis.find(
      (categoria) => categoria.id === categoryId
    )

    return categoriaEncontrada?.name ?? 'Categoria não encontrada'
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

      {/* Erro */}
      {erro && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900">
            Novo produto
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Cadastre um novo produto.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Nome */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nome do produto
              </label>

              <input
                type="text"
                value={nomeProduto}
                onChange={(event) =>
                  setNomeProduto(event.target.value)
                }
                placeholder="Ex: Arroz"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(event) =>
                  setCategoria(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="">
                  Selecione uma categoria
                </option>

                {categoriasDisponiveis.map((categoriaItem) => (
                  <option
                    key={categoriaItem.id}
                    value={categoriaItem.id}
                  >
                    {categoriaItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Preço
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={preco}
                onChange={(event) =>
                  setPreco(event.target.value)
                }
                placeholder="Ex: 12.90"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            {/* Unidade */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Unidade
              </label>

              <input
                type="text"
                value={unidade}
                onChange={(event) =>
                  setUnidade(event.target.value)
                }
                placeholder="Ex: 5 kg"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={cancelarFormulario}
              disabled={salvando}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={adicionarProduto}
              disabled={salvando}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Adicionar produto'}
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
            {categoriasUsadas.size}
          </p>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Seus produtos
        </h2>

        {carregando ? (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              Carregando produtos...
            </p>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow">
            <Package
              size={40}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Nenhum produto encontrado
            </h3>

            <p className="mt-1 text-gray-500">
              Tente pesquisar por outro nome ou cadastre um novo produto.
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
                      {produto.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {obterNomeCategoria(produto.category)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoverProduto(produto.id)
                    }
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
                      {produto.unit}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Preço
                    </p>

                    <p className="text-xl font-bold text-blue-600">
                      R$ {Number(produto.price).toFixed(2)}
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