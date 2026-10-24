// Instalação do app na tela inicial (PWA).
//
// - Android (Chrome, Edge, Samsung Internet...): o navegador dispara
//   `beforeinstallprompt`; guardamos o evento e mostramos nosso botão
//   "Instalar app", que abre a janela nativa de instalação.
// - iPhone/iPad: o Safari não tem esse evento. Mostramos o passo a passo
//   (Compartilhar → Adicionar à Tela de Início).
// - Só funciona em HTTPS (ou localhost), então no teste pela rede local
//   (http://192.168...) o botão não aparece.

interface EventoDeInstalacao extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let eventoGuardado: EventoDeInstalacao | null = null
let instaladoAgora = false

const ouvintes = new Set<() => void>()

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte())
}


export function iniciarPwa() {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Impede o banner automático; o app mostra o próprio botão.
    event.preventDefault()
    eventoGuardado = event as EventoDeInstalacao
    avisar()
  })

  window.addEventListener('appinstalled', () => {
    eventoGuardado = null
    instaladoAgora = true
    avisar()
  })

  // Em desenvolvimento o service worker atrapalharia (guarda versões velhas).
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Sem service worker o app funciona igual, só não instala offline.
      })
    })
  }
}


export function aoMudarInstalacao(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => {
    ouvintes.delete(ouvinte)
  }
}


export function estaInstalado() {
  return (
    instaladoAgora ||
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari do iOS
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}


export function podeInstalarDireto() {
  return eventoGuardado !== null
}


export function ehIos() {
  const ua = navigator.userAgent

  return (
    /iphone|ipad|ipod/i.test(ua) ||
    // iPad com iPadOS se apresenta como Mac.
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  )
}


export async function instalar(): Promise<boolean> {
  if (!eventoGuardado) {
    return false
  }

  const evento = eventoGuardado
  eventoGuardado = null

  await evento.prompt()
  const { outcome } = await evento.userChoice

  avisar()

  return outcome === 'accepted'
}
