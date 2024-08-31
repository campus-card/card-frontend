import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/route'

export default function App() {
  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  )
}
