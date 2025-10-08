import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import './globals.css'
import App from './App.jsx'

// Nettoyage préventif des portals au démarrage
if (typeof document !== 'undefined') {
  const portalRoot = document.getElementById('portal-root');
  if (portalRoot) {
    portalRoot.innerHTML = '';
  }
}

// Désactivation de StrictMode pour éviter les problèmes de portals
createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="top-right" richColors closeButton />
  </>,
)
