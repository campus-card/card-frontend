import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'

/*
* react-router新版用法, 通过createBrowserRouter创建路由表
* 使用<RouterProvider router={router} />作为路由出口, 而不是useRoutes
* 导出的router对象可以在组件之外使用, 用于路由跳转
*  */
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
      { path: 'card', Component: lazy(() => import('@/view/student/card')) },
      { path: 'purchase', Component: lazy(() => import('@/view/student/purchase')) },
      { path: 'purchase-record', Component: lazy(() => import('@/view/student/purchase-record')) },
      { path: 'product', Component: lazy(() => import('@/view/shop/product')) },
      { path: 'sale-record', Component: lazy(() => import('@/view/shop/sale-record')) },
      { path: 'userInfo', Component: lazy(() => import('@/view/userInfo')) },
      { path: 'setting', Component: lazy(() => import('@/view/setting')) },
      { path: 'image-share', Component: lazy(() => import('@/view/imageShare')) },
    ]
  }
])
