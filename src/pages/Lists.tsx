import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  ShoppingCart,
  Home,
  X,
  ArrowRight,
} from 'lucide-react'

import {
  listarListas,
  criarLista,
  listarItensDaLista,
  type List,
} from '../services/lists'

function Lists() {
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [nomeLista, setNomeLista] = useState('')
  const [orcamento, setOrcamento] = useState('')

  const [listas, setListas] = useState<List[]>([])

  const [resumos, setResumos] = useState<
    Record<number, { produtos: number; valor: number }>
  >({})

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const navigate = useNavigate()

  async function carregarListas() {
    try {
      setCarregando(true)
      setErro('')

      const dados = await listarListas()

      setListas(dados)

      const resultados = await Promise.all(
        dados.map(async (lista) => {
          try {
            const itens = await listarItensDaLista(lista.id)

            const valor = itens.reduce(
              (total, item) =>
                total + Number(item.subtotal ?? 0),
              0,
            )

            return {
              id: lista.id,
              produtos: itens.length,
              valor,
            }
          } catch {
            return {
              id: lista.id,
              produtos: 0,
              valor: 0,
            }
          }
        }),
      )

      const novosResumos: Record<
        number,
        { produtos: number; valor: number }
      > = {}

      resultados.forEach((resultado) => {
        novosResumos[resultado.id] = {
          produtos: resultado.produtos,
          valor: resultado.valor,
        }
      })

      setResumos(novosResumos)
    } catch {
      setErro(
        'Não foi possível carregar suas listas.',
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarListas()
  }, [])

  async function criarNovaLista() {
    if (nomeLista.trim() === '') {
      return
    }

    try {
      setSalvando(true)
      setErro('')

      const novaLista = await criarLista({
        name: nomeLista.trim(),
        budget:
          orcamento === ''
            ? 0
            : Number(orcamento),
      })

      setListas((listasAtuais) => [
        ...listasAtuais,
        novaLista,
      ])

      setResumos((resumosAtuais) => ({
        ...resumosAtuais,
        [novaLista.id]: {
          produtos: 0,
          valor: 0,
        },
      }))

      setNomeLista('')
      setOrcamento('')
      setMostrarFormulario(false)
    } catch {
      setErro(
        'Não foi possível criar a lista.',
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
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
          onClick={() =>
            setMostrarFormulario(true)
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nova lista
        </button>
      </div>

      {erro && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {erro}
        </div>
      )}

      {mostrarFormulario && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">
            Criar nova lista
          </h2>

          <input
            type="text"
            value={nomeLista}
            onChange={(event) =>
              setNomeLista(event.target.value)
            }
            placeholder="Nome da lista"
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={orcamento}
            onChange={(event) =>
              setOrcamento(event.target.value)
            }
            placeholder="Orçamento (opcional)"
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false)
                setNomeLista('')
                setOrcamento('')
              }}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
            >
              <X size={18} />
              Cancelar
            </button>

            <button
              type="button"
              onClick={criarNovaLista}
              disabled={salvando}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando
                ? 'Criando...'
                : 'Criar lista'}
            </button>
          </div>
        </div>
      )}

      {carregando ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            Carregando suas listas...
          </p>
        </div>
      ) : listas.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow">
          <ShoppingCart
            size={40}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Você ainda não possui listas
          </h2>

          <p className="mt-2 text-gray-500">
            Crie sua primeira lista de compras.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {listas.map((lista, index) => {
            const resumo = resumos[lista.id] ?? {
              produtos: 0,
              valor: 0,
            }

            return (
              <div
                key={lista.id}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <div className="flex items-center gap-3">
                  {index === 0 ? (
                    <ShoppingCart size={22} />
                  ) : (
                    <Home size={22} />
                  )}

                  <h2 className="text-xl font-bold">
                    {lista.name}
                  </h2>
                </div>

                <p className="mt-2 text-gray-500">
                  {resumo.produtos} produtos
                </p>

                <p className="mt-1 font-semibold">
                  R$ {resumo.valor.toFixed(2)}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Orçamento: R${' '}
                  {Number(lista.budget).toFixed(2)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/listas/${lista.id}`,
                    )
                  }
                  className="mt-6 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
                >
                  Abrir lista
                  <ArrowRight size={18} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Lists