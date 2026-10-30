import { useState } from 'react'
import { Camera } from 'lucide-react'

import LeitorDeCodigo from './LeitorDeCodigo'
import { completarPeloCodigo, type Product } from '../services/products'


// Para produto sem foto (ex.: veio da nota fiscal): lê o código de barras da
// embalagem e puxa foto, marca e embalagem (só o que estiver vazio).
function AdicionarFoto({
  produtoId,
  nome,
  aoCompletar,
}: {
  produtoId: number
  nome: string
  aoCompletar: (produto: Product) => void
}) {
  const [cameraAberta, setCameraAberta] = useState(false)
  const [aviso, setAviso] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function ler(codigo: string) {
    setCameraAberta(false)
    try {
      setSalvando(true)
      setAviso('')
      const { produto, encontrado } = await completarPeloCodigo(produtoId, codigo)
      aoCompletar(produto)
      if (!encontrado || !produto.image_url) {
        setAviso('Código salvo, mas esse produto ainda não tem foto nas bases abertas.')
      }
    } catch (falha) {
      setAviso(falha instanceof Error ? falha.message : 'Não foi possível usar o código.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setAviso('')
          setCameraAberta(true)
        }}
        disabled={salvando}
        aria-label={`Adicionar foto de ${nome} pelo código de barras`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 transition hover:text-brand-800 disabled:opacity-60"
      >
        <Camera size={14} aria-hidden="true" />
        {salvando ? 'Buscando foto...' : 'Adicionar foto'}
      </button>

      {aviso && <p role="status" className="mt-1 text-xs text-amber-800">{aviso}</p>}

      {cameraAberta && (
        <LeitorDeCodigo
          tipo="barras"
          titulo="Adicionar foto"
          dica="Aponte para o código de barras da embalagem deste produto."
          aoFechar={() => setCameraAberta(false)}
          aoLer={ler}
        />
      )}
    </div>
  )
}


export default AdicionarFoto
