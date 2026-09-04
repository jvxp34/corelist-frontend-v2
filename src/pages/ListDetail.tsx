import { useParams } from 'react-router-dom'

function ListDetail() {
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
              {lista.produtos}
            </p>
          </div>

          <div className="rounded-xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Valor estimado
            </p>

            <p className="mt-1 text-2xl font-bold">
              R$ {lista.valor.toFixed(2)}
            </p>
          </div>

        </div>

        <button
          type="button"
          className="mt-6 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Adicionar produto
        </button>

      </div>

    </div>
  )
}

export default ListDetail