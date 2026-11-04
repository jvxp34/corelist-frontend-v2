import { useCallback, useState } from 'react'

import type { Origem } from '../services/precos'


export type EstadoLocalizacao = 'desligada' | 'buscando' | 'ativa' | 'negada' | 'indisponivel'


// Navegador de dentro do WhatsApp, Instagram ou Facebook: costuma bloquear a
// localização mesmo com a permissão do celular ligada.
function navegadorDeApp() {
  return /FBAN|FBAV|Instagram|WhatsApp|Line\//i.test(navigator.userAgent)
}


// Texto para a pessoa saber o que fazer quando a localização não vem.
export function mensagemDaLocalizacao(estado: EstadoLocalizacao): string | null {
  if (estado === 'negada') {
    return navegadorDeApp()
      ? 'Este navegador do aplicativo bloqueia a localização. Abra o site no Chrome (menu ⋮ › Abrir no navegador) e tente de novo.'
      : 'A localização está bloqueada para este site. Toque no cadeado ao lado do endereço › Permissões › Localização › Permitir, e tente de novo.'
  }
  if (estado === 'indisponivel') {
    return navegadorDeApp()
      ? 'Não consegui sua localização. Abra o site no Chrome (menu ⋮ › Abrir no navegador) e tente de novo.'
      : 'Não consegui achar sua localização. Confira se a localização (GPS) do celular está ligada e tente de novo.'
  }
  return null
}


// Localização do aparelho, só quando a pessoa pede ("Perto de mim").
// Primeiro tenta a posição rápida (rede); se não vier, tenta o GPS.
export function useLocalizacao() {
  const [estado, setEstado] = useState<EstadoLocalizacao>('desligada')
  const [origem, setOrigem] = useState<Origem | null>(null)

  const pedir = useCallback(() => {
    if (!('geolocation' in navigator) || !window.isSecureContext) {
      setEstado('indisponivel')
      return
    }
    setEstado('buscando')

    const deuCerto = (posicao: GeolocationPosition) => {
      setOrigem({ lat: posicao.coords.latitude, lng: posicao.coords.longitude })
      setEstado('ativa')
    }
    const falhou = (erro: GeolocationPositionError) => {
      setOrigem(null)
      setEstado(erro.code === erro.PERMISSION_DENIED ? 'negada' : 'indisponivel')
    }

    navigator.geolocation.getCurrentPosition(
      deuCerto,
      (erro) => {
        if (erro.code === erro.PERMISSION_DENIED) {
          falhou(erro)
          return
        }
        // Demorou ou não achou pela rede: segunda tentativa com o GPS.
        navigator.geolocation.getCurrentPosition(deuCerto, falhou, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        })
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  const desligar = useCallback(() => {
    setOrigem(null)
    setEstado('desligada')
  }, [])

  return { estado, origem, pedir, desligar, mensagem: mensagemDaLocalizacao(estado) }
}
