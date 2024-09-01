import '@/assets/style/common.module.scss'

import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from '@/redux'
import { SnackbarProvider } from 'notistack'
import { ToastConfiguration } from '@/util/Toast.ts'

createRoot(document.getElementById('root')!).render(
  <>
    {/* CssBaseline - MUI中提供的类似normalize.css的浏览器样式重置
     相比于normalize.css, 能更适配MUI */}
    <CssBaseline />
      <Provider store={store}>
        {/* @ts-ignore PersistGate配置持久化 */}
        <PersistGate persistor={persistor} loading={<span>加载中...</span>}>
          {/* 弹窗(notistack)的provider. 默认设为顶部居中 */}
          <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
            <ToastConfiguration />
            <App />
          </SnackbarProvider>
        </PersistGate>
      </Provider>
  </>
)
