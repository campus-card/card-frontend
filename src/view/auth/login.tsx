import { Box, Button, Grid2, TextField } from '@mui/material'
import '@/view/auth/login.scss'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <Box className="login">
      <Grid2 container
             size={12}
             rowSpacing='10px'
      >
        <Grid2 size={12}>
          <div className='title'>登录</div>
        </Grid2>
        <Grid2 size={12}>
          <TextField className='input' variant='outlined' label='用户名' />
        </Grid2>
        <Grid2 size={12}>
          <TextField className='input' variant='outlined' label='密码' />
        </Grid2>
        <Grid2 container columnSpacing='20px' size={12}>
          <Grid2 size={6}>
            <Button className='button'
                    variant='contained'
                    onClick={() => navigate('/index')}
            >登录</Button>
          </Grid2>
          <Grid2 size={6}>
            <Button className='button register'
                    variant='contained'
                    onClick={() => navigate('/auth/register')}
            >注册</Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  )
}
