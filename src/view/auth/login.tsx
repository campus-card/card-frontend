import { Box, Button, FormControlLabel, Grid2, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material'
import '@/view/auth/login.scss'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { UserRole } from '@/type/User.ts'
import { apiLogin } from '@/api/auth.ts'
import { useAppDispatch } from '@/redux/typing.ts'
import { setLoginData } from '@/redux/reducer/user.ts'
import { AccountCircle, LockOutlined } from '@mui/icons-material'

export default function Login() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [role, setRole] = useState<UserRole>(UserRole.Student)
  // use钩子函数只能在函数组件中使用, 不能写到下面的login里面
  const dispatch = useAppDispatch()

  const login = async () => {
    const res = await apiLogin(username, password, role)
    if (res.code === 200) {
      dispatch(setLoginData(res.data))
      enqueueSnackbar(`欢迎回来, ${res.data.username}`, { variant: 'success'})
      navigate('/index')
    } else {
      console.warn('登录失败:', res)
      enqueueSnackbar(res.message, { variant: 'error' })
    }
  }

  return (
    <Box className="login">
      <Grid2 container
             size={12}
             rowSpacing='10px'
      >
        <Grid2 size={12}>
          <RadioGroup row value={role} onChange={(_e, value) => {setRole(+value)}}>
            <FormControlLabel value={UserRole.Student} control={<Radio />} label="学生登录" />
            <FormControlLabel value={UserRole.Shop} control={<Radio />} label="商户登录" />
          </RadioGroup>
        </Grid2>
        <Grid2 size={12}>
          <TextField
            value={username}
            onChange={e => setUsername(e.target.value)}
            className='input'
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><AccountCircle/></InputAdornment>}}}
            label='用户名'
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='input'
            type={'password'}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><LockOutlined/></InputAdornment>}}}
            label='密码'
          />
        </Grid2>
        <Grid2 container columnSpacing='20px' size={12}>
          <Grid2 size={6}>
            <Button className='button'
                    variant='contained'
                    onClick={login}
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
