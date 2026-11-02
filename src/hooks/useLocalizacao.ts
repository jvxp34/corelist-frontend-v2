import { useCallback, useState } from 'react'

import type { Origem } from '../services/precos'


export type EstadoLocalizacao = 'desligada' | 'buscando' | 'ativa' | 'negada' | 'indisponivel'


// Localização do aparelho, só quando a pessoa pede ("Perto de mim").
// Fica só na memória da página: não é salva em lugar nenhum.
export function useLocalizacao() {
  const [estado, setEstado] = useState<EstadoLocalizacao>('desligada')
  const [origem, setOrigem] = useState<Origem | null>(null)

  const pedir = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setEstado('indisponivel')
      return
    }
    setEstado('buscando')
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setOrigem({ lat: posicao.coords.latitude, lng: posicao.coords.longitude })
        setEstado('ativa')
      },
      (erro) => {
        setOrigem(null)
        setEstado(erro.code === erro.PERMISSION_DENIED ? 'negada' : 'indisponivel')
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  const desligar = useCallback(() => {
    setOrigem(null)
    setEstado('desligada')
  }, [])

  return { estado, origem, pedir, desligar }
}
