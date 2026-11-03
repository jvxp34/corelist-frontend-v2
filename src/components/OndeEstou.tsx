import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react'

import { ondeEstou, type Origem } from '../services/precos'


// "Você está perto de: Rua 10 de Julho, Centro" + um mapinha com o seu ponto
// (OpenStreetMap). A posição vai ao servidor do app só para achar o endereço
// (arredondada, sem guardar quem pediu).
function OndeEstou({ origem }: { origem: Origem }) {
  const [texto, setTexto] = useState<string | null>(null)
  const [mapaAberto, setMapaAberto] = useState(false)

  useEffect(() => {
    let ativo = true
    let espera: ReturnType<typeof setTimeout> | undefined
    // O mapa às vezes demora na primeira vez: tenta de novo uma vez.
    async function buscar(tentativa: number) {
      const endereco = await ondeEstou(origem).catch(() => null)
      if (!ativo) return
      if (endereco) setTexto(endereco)
      else if (tentativa === 1) espera = setTimeout(() => void buscar(2), 2000)
    }
    void buscar(1)
    return () => {
      ativo = false
      clearTimeout(espera)
    }
  }, [origem])

  const margem = 0.004
  const mapa = `https://www.openstreetmap.org/export/embed.html?${new URLSearchParams({
    bbox: [origem.lng - margem, origem.lat - margem, origem.lng + margem, origem.lat + margem].join(','),
    layer: 'mapnik',
    marker: `${origem.lat},${origem.lng}`,
  })}`

  return (
    <div className="mt-2 rounded-xl border border-brand-100 bg-brand-50/60 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-ink">
          <MapPin size={15} aria-hidden="true" className="shrink-0 text-brand-600" />
          <span className="truncate">
            {texto ? <>Você está perto de: <strong className="font-semibold">{texto}</strong></> : 'Usando sua localização'}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setMapaAberto(!mapaAberto)}
          aria-expanded={mapaAberto}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          {mapaAberto ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
          {mapaAberto ? 'Esconder mapa' : 'Ver no mapa'}
        </button>
      </div>
      {mapaAberto && (
        <>
          <iframe
            title="Mapa da sua localização"
            src={mapa}
            loading="lazy"
            className="mt-2 h-48 w-full rounded-lg border border-line"
          />
          <p className="mt-1 text-[11px] text-muted">© colaboradores do OpenStreetMap</p>
        </>
      )}
    </div>
  )
}


export default OndeEstou
