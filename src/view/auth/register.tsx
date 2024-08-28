import '@/view/auth/register.scss'
import { Box, Button, Grid2, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  return (
    <Box className="register">
      <Grid2 container
             size={12}
             rowSpacing='10px'
      >
        <Grid2 size={12}>
          <div className='title'>注册</div>
        </Grid2>
        <Grid2 size={12}>
          <TextField className='input' variant='outlined' label='用户名' />
        </Grid2>
        <Grid2 size={12}>
          <TextField className='input' variant='outlined' label='密码' />
        </Grid2>
        <Grid2 size={12}>
          <TextField className='input' variant='outlined' label='确认密码' />
        </Grid2>
        <Grid2 size={12}>
          <Button className='button' variant='contained' onClick={() => navigate('/auth/login')}>注册</Button>
        </Grid2>
      </Grid2>
    </Box>
  )
}
