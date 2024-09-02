import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducer/user.ts'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt'

// 持久化配置
const persistConfig = {
  key: 'campus-card',
  storage,
  whitelist: ['userinfo', 'loginData', 'themePreference'],
  // 加密存储
  transforms: [
    encryptTransform({
      secretKey: 'cAmPuS-cArD_LoL.1487364',
      onError: error => {
        console.error('加密失败', error)
      }
    })
  ]
}

const store = configureStore({
  reducer: {
    user: persistReducer(persistConfig, userReducer),
  },
  // 跟redux-persist一起使用时, 需要额外配置
  // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

// 导出persistor, 在main.tsx中设置给PersistGate组件
export const persistor = persistStore(store)

export default store
