import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { platform } from './platforms/PlatformDetector'
import { api } from './services/api'

// Apply active operating system attributes & setup optimizations
platform.applyOSToDocument();

// Register Service Worker for PWA Rural Offline resilience across all environments
if ('serviceWorker' in navigator) {
  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[CareFlow PWA] ServiceWorker active for rural offline access:', reg.scope);
        // Prompt immediate check for offline bundle updates
        reg.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('[CareFlow PWA] ServiceWorker registration notice:', err);
      });
  };

  if (document.readyState === 'complete') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
} else if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  console.warn('[CareFlow PWA] Insecure context: Mobile browsers require HTTPS to enable Service Worker offline caching. Use https://' + window.location.host);
}

// Preload clinical databases into offline IndexedDB for zero-connectivity areas
api.preloadOfflineDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


