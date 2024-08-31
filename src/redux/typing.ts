import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux'
import store from '@/redux/index.ts'
import { createSelector } from '@reduxjs/toolkit'

/* 属于程序方面的type, 而不是业务的type, 所以就不写在@/type下了 */
// 为state和dispatch添加类型
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

// 为hooks添加类型
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
export const useAppStore: () => AppStore = useStore

// createSelector的类型
export const createAppSelector = createSelector
