import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'

/*
* react-router新版用法, 通过createBrowserRouter创建路由表
* 使用<RouterProvider router={router} />作为路由出口, 而不是useRoutes
* 导出的router对象可以在组件之外使用, 用于路由跳转
*  */
// todo: keep-alive效果. 目前react不支持, 计划引入react-activation库
export const router = createBrowserRouter([
  /* 重定向 */
  { path: '/', element: <Navigate to='/auth/login'/> },
  { path: '/auth', element: <Navigate to='/auth/login'/> },
  { path: '/index', element: <Navigate to='/index/home'/> },
  /* 路由表 */
  {
    path: '/auth',
    // note: 📌📌使用React自带的lazy函数实现路由懒加载. 在路由出口需要使用Suspense包裹. 可以选择fallback属性显示加载中状态(skeleton)
    Component: lazy(() => import('@/view/auth')),
    children: [
      { path: 'login', Component: lazy(() => import('@/view/auth/login')) },
      { path: 'register', Component: lazy(() => import('@/view/auth/register')) }
    ]
  },
  {
    path: '/index',
    Component: lazy(() => import('@/view/index')),
    children: [
      { path: 'home', Component: lazy(() => import('@/view/home')) },
      { path: 'card', Component: lazy(() => import('@/view/card')) },
      { path: 'purchase', Component: lazy(() => import('@/view/purchase')) },
      { path: 'shop', Component: lazy(() => import('@/view/shop')) },
      { path: 'userInfo', Component: lazy(() => import('@/view/userInfo')) },
      { path: 'setting', Component: lazy(() => import('@/view/setting')) }
    ]
  }
])
