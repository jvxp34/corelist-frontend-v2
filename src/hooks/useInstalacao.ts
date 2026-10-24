import { useEffect, useState } from 'react'

import {
  aoMudarInstalacao,
  ehIos,
  estaInstalado,
  instalar,
  podeInstalarDireto,
} from '../pwa/instalacao'


function lerEstado() {
  return {
    instalado: estaInstalado(),
    podeInstalarDireto: podeInstalarDireto(),
    ehIos: ehIos(),
  }
}


export function useInstalacao() {
  const [estado, setEstado] = useState(lerEstado)

  useEffect(
    () => aoMudarInstalacao(() => setEstado(lerEstado())),
    [],
  )

  return {
    ...estado,
    instalar,
    // Mostrar a opção só onde ela funciona (Android com o evento, ou iOS).
    disponivel:
      !estado.instalado && (estado.podeInstalarDireto || estado.ehIos),
  }
}
