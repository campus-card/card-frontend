import '@/view/auth/index.scss'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function Auth() {

  return (
    <Container className='auth'>
      <div className='app-title'>校园卡消费系统</div>
      {/* 二级路由 */}
      <Outlet />
    </Container>
  )
}
