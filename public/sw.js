// Service worker do CompraFácil (PWA).
//
// Estratégia simples para não servir versão velha do app:
// - páginas (navegação): sempre busca na rede; sem internet, mostra o
//   index.html guardado, e o app carrega a última versão que tinha;
// - arquivos de /assets/ (têm hash no nome, nunca mudam): cache primeiro;
// - chamadas à API e a outros sites: não passam pelo cache.

const CACHE = 'comprafacil-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add('/index.html')),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE)
          .map((nome) => caches.delete(nome)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone()
          caches.open(CACHE).then((cache) => cache.put('/index.html', copia))
          return resposta
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (guardado) =>
          guardado ||
          fetch(request).then((resposta) => {
            const copia = resposta.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copia))
            return resposta
          }),
      ),
    )
  }
})
