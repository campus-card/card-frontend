import { Navigate, RouteObject } from 'react-router-dom'
import { lazy } from 'react'

// todo: keep-alive效果. 目前react不支持, 计划引入react-activation库
export const routes: RouteObject[] = [
  /* 重定向 */
  { path: '/', element: <Navigate to='/auth/login'/> },
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
      {
        path: 'home',
        Component: lazy(() => import('@/view/home'))
      },
      { path: 'card', Component: lazy(() => import('@/view/card')) },
      { path: 'userinfo', Component: lazy(() => import('@/view/userinfo')) },
      { path: 'setting', Component: lazy(() => import('@/view/setting')) }
    ]
  }
]
