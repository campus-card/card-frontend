import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/style/common.module.scss'
import App from '@/App.tsx'
import { CssBaseline } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  // todo: 构建时移除StrictMode
  <StrictMode>
    {/* CssBaseline - MUI中提供的类似normalize.css的浏览器样式重置
     相比于normalize.css, 能更适配MUI */}
    <CssBaseline />
    <App />
  </StrictMode>,
)
