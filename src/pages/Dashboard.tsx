import { Lightbulb } from 'lucide-react'

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Olá, João 
        </h1>

        <p className="mt-2 text-gray-500">
          Aqui está o resumo das suas compras.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Listas
            </p>
            <p className="mt-2 text-3xl font-bold">
              8
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Gastos
            </p>
            <p className="mt-2 text-3xl font-bold">
              R$ 642,90
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Economia
            </p>
            <p className="mt-2 text-3xl font-bold">
              R$ 47,80
            </p>
          </div>

        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">
          <div className="flex items-center gap-3">
            <Lightbulb size={22} />
            <h2 className="text-xl font-bold">
              Oportunidades
            </h2>
          </div>
          </h2>

          <div className="mt-4 space-y-3">
            <p>🟢 Café está 18% mais barato no Mercado X</p>
            <p>🟡 Arroz aumentou R$ 3,20</p>
            <p>🔴 Sua lista está R$ 14 acima da média</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard