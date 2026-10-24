import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { iniciarPwa } from './pwa/instalacao'

// Antes do React: o aviso de "pode instalar" do Android chega cedo.
iniciarPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
