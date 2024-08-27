import '@/view/index/index.scss'
import { Button } from '@mui/material'

export default function Index() {
  return (
    <div className="index">
      123
      <h1>Index Page</h1>
      <Button onClick={() => console.log('你好')} variant="contained">测试</Button>
    </div>
  )
}
