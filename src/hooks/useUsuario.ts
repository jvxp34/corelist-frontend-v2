import { useEffect, useState } from 'react'

import {
  aoMudarUsuario,
  obterUsuarioAtual,
  type Usuario,
} from '../services/auth'

// Usuário logado (ou null enquanto carrega ou se a sessão expirou).
export function useUsuario() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null)

  useEffect(() => {
    let cancelado = false

    obterUsuarioAtual()
      .then((dados) => {
        if (!cancelado) {
          setUsuario(dados)
        }
      })
      .catch(() => {
        // Sem usuário: o menu mostra só "Minha conta".
      })

    const pararDeOuvir = aoMudarUsuario(setUsuario)

    return () => {
      cancelado = true
      pararDeOuvir()
    }
  }, [])

  return usuario
}
