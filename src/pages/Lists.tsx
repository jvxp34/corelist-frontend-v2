import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ShoppingCart, Home, X, ArrowRight } from 'lucide-react'

function Lists() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nomeLista, setNomeLista] = useState('')

  const navigate = useNavigate()

  const [listas, setListas] = useState([
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
  ])

  function criarLista() {
    if (nomeLista.trim() === '') {
      return
    }

    const novaLista = {
      id: Date.now(),
      nome: nomeLista,
      produtos: 0,
      valor: 0,
    }

    setListas([...listas, novaLista])

    setNomeLista('')
    setMostrarFormulario(false)
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* Cabeçalho */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Minhas listas
          </h1>

          <p className="mt-2 text-gray-500">
            Organize suas compras de forma inteligente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nova lista
        </button>

      </div>

      {/* Formulário */}

      {mostrarFormulario && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">

          <h2 className="text-xl font-bold">
            Criar nova lista
          </h2>

          <input
            type="text"
            value={nomeLista}
            onChange={(event) => setNomeLista(event.target.value)}
            placeholder="Nome da lista"
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
          />

          <div className="mt-4 flex gap-3">

            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false)
                setNomeLista('')
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
            >
              <X size={18} />
              Cancelar
            </button>

            <button
              type="button"
              onClick={criarLista}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              <X size={18} />
              Criar lista
            </button>

          </div>

        </div>
      )}

      {/* Listas */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {listas.map((lista) => (
          <div
            key={lista.id}
            className="rounded-2xl bg-white p-6 shadow"
          >

            <div className="flex items-center gap-3">
              {lista.id === 1 ? (
                <ShoppingCart size={22} />
              ) : (
                <Home size={22} />
              )}

              <h2 className="text-xl font-bold">
                {lista.nome}
              </h2>
            </div>

            <p className="mt-2 text-gray-500">
              {lista.produtos} produtos
            </p>

            <p className="mt-1 font-semibold">
              R$ {lista.valor.toFixed(2)}
            </p>

            <button
              type="button"
              onClick={() => navigate(`/listas/${lista.id}`)}
              className="mt-6 rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
            >
              Abrir lista
              <ArrowRight size={18}/>
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Lists