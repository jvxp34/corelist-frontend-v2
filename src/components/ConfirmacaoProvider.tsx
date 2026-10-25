import { useCallback, useEffect, useId, useRef, useState } from 'react'

import {
  ContextoConfirmacao,
  type PedidoDeConfirmacao,
} from '../hooks/useConfirmacao'


interface PedidoAberto extends PedidoDeConfirmacao {
  responder: (resposta: boolean) => void
}


function ConfirmacaoProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pedido, setPedido] = useState<PedidoAberto | null>(null)

  const confirmar = useCallback(
    (novo: PedidoDeConfirmacao) =>
      new Promise<boolean>((resolve) => {
        setPedido({ ...novo, responder: resolve })
      }),
    [],
  )

  function responder(resposta: boolean) {
    pedido?.responder(resposta)
    setPedido(null)
  }

  return (
    <ContextoConfirmacao.Provider value={confirmar}>
      {children}

      {pedido && (
        <JanelaConfirmacao
          pedido={pedido}
          aoResponder={responder}
        />
      )}
    </ContextoConfirmacao.Provider>
  )
}


function JanelaConfirmacao({
  pedido,
  aoResponder,
}: {
  pedido: PedidoAberto
  aoResponder: (resposta: boolean) => void
}) {
  const idTitulo = useId()
  const idMensagem = useId()
  const botaoCancelar = useRef<HTMLButtonElement>(null)

  // Foco começa no "Cancelar" (a opção segura); Esc cancela.
  useEffect(() => {
    botaoCancelar.current?.focus()

    function aoApertarTecla(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        aoResponder(false)
      }
    }

    window.addEventListener('keydown', aoApertarTecla)

    return () =>
      window.removeEventListener('keydown', aoApertarTecla)
  }, [aoResponder])

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cancelar"
        tabIndex={-1}
        onClick={() => aoResponder(false)}
        className="absolute inset-0 bg-ink/40"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={pedido.mensagem ? idMensagem : undefined}
        className="relative w-full rounded-t-3xl bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-6 shadow-xl sm:max-w-md sm:rounded-2xl sm:pb-5"
      >
        <h2
          id={idTitulo}
          className="font-display text-lg font-semibold leading-snug"
        >
          {pedido.titulo}
        </h2>

        {pedido.mensagem && (
          <p
            id={idMensagem}
            className="mt-2 text-[15px] leading-relaxed text-muted"
          >
            {pedido.mensagem}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={botaoCancelar}
            type="button"
            onClick={() => aoResponder(false)}
            className="h-12 rounded-xl border border-line bg-white px-5 text-[15px] font-semibold text-ink hover:bg-canvas sm:h-11"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => aoResponder(true)}
            className={`h-12 rounded-xl px-5 text-[15px] font-semibold text-white sm:h-11 ${
              pedido.perigoso
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {pedido.textoConfirmar ?? 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}


export default ConfirmacaoProvider
