import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/style/reset.scss'
import '@/assets/style/common.module.scss'
import App from '@/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
