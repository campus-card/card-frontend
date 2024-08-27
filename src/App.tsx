import css from '@/assets/style/common.module.scss'
import Index from '@/view/index'

export default function App() {
  console.log('css = ', css)

  return (
    <div className='app'>
      <Index />
    </div>
  )
}
