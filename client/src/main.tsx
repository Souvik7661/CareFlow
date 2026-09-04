import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { platform } from './platforms/PlatformDetector'

// Apply active operating system attributes & setup optimizations
platform.applyOSToDocument();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

