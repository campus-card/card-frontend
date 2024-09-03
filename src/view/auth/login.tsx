import { Box, Button, FormControlLabel, Grid2, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material'
import style from '@/view/auth/login.module.scss'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserRole } from '@/type/User.ts'
import { apiLogin } from '@/api/auth.ts'
import { useAppDispatch } from '@/redux/typing.ts'
import { setLoginData } from '@/redux/reducer/user.ts'
import { AccountCircle, LockOutlined } from '@mui/icons-material'
import Toast from '@/util/Toast.ts'

export default function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [role, setRole] = useState<UserRole>(UserRole.Student)
  // use钩子函数只能在函数组件中使用, 不能写到下面的login里面
  const dispatch = useAppDispatch()

  const login = async () => {
    const res = await apiLogin(username, password, role)
    if (res.code === 200) {
      dispatch(setLoginData(res.data))
      Toast.success(`欢迎回来, ${res.data.username}`)
      navigate('/index')
    } else {
      console.warn('登录失败:', res)
      Toast.error(res.message)
    }
  }

  return (
    <Box className={style.login}>
      <Grid2 container
             size={12}
             rowSpacing='10px'
      >
        <Grid2 size={12}>
          <RadioGroup row value={role} onChange={(_e, value) => {setRole(+value)}}>
            {/* label里的内容要用sx属性来跟进一下主题色的样式 */}
            <FormControlLabel value={UserRole.Student} control={<Radio />} label={<Box sx={{ color: 'text.primary' }}>学生登录</Box>} />
            <FormControlLabel value={UserRole.Shop} control={<Radio />} label={<Box sx={{ color: 'text.primary' }}>商户登录</Box>} />
          </RadioGroup>
        </Grid2>
        <Grid2 size={12}>
          <TextField
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={style.input}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><AccountCircle/></InputAdornment>}}}
            label='用户名'
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={style.input}
            type={'password'}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><LockOutlined/></InputAdornment>}}}
            label='密码'
          />
        </Grid2>
        <Grid2 container columnSpacing='20px' size={12}>
          <Grid2 size={6}>
            <Button className={style.button}
                    variant='contained'
                    onClick={login}
            >登录</Button>
          </Grid2>
          <Grid2 size={6}>
            <Button className={`${style.button} ${style.register}`}
                    variant='contained'
                    onClick={() => navigate('/auth/register')}
            >注册</Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  )
}
