import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/style/common.module.scss'
import App from '@/App.tsx'
import { CssBaseline } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* CssBaseline - MUI中提供的类似normalize.css的浏览器样式重置 */}
    <CssBaseline />
    <App />
  </StrictMode>,
)
