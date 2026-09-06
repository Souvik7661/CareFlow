import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { platform } from './platforms/PlatformDetector'
import { api } from './services/api'

// Apply active operating system attributes & setup optimizations
platform.applyOSToDocument();

// Register Service Worker for PWA Rural Offline resilience
if ('serviceWorker' in navigator && import.meta.env.PROD !== false) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('[CareFlow PWA] ServiceWorker active for rural offline access:', reg.scope),
      (err) => console.warn('[CareFlow PWA] ServiceWorker registration warning:', err)
    );
  });
}

// Preload clinical databases into offline IndexedDB for zero-connectivity areas
api.preloadOfflineDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


