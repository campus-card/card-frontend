import { useRoutes } from 'react-router-dom'
import { routes } from '@/route'
import { Suspense } from 'react'

export default function App() {
  const routerView = useRoutes(routes)

  return (
    <div className='app'>
      <Suspense>
        {routerView}
      </Suspense>
    </div>
  )
}
