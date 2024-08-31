import '@/view/auth/register.scss'
import { Box, Button, FormControlLabel, Grid2, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AccountCircle, Lock, LockOutlined } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { UserRole } from '@/type/User.ts'
import { apiRegister } from '@/api/auth.ts'

export default function Register() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  /* 表单 */
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [role, setRole] = useState<UserRole>(UserRole.Student)
  /* 校验 */
  const validate = () => {
    if (!username || !password || !confirmPassword) {
      enqueueSnackbar('输入不能有空', { variant: 'error' })
      return false
    }
    if (username.length < 4 || username.length > 30) {
      enqueueSnackbar('用户名长度应在4-30之间', { variant: 'error' })
      return false
    }
    if (password.length < 6) {
      enqueueSnackbar('密码长度应不小于6', { variant: 'error' })
      return false
    }
    if (password !== confirmPassword) {
      enqueueSnackbar('两次密码不一致', { variant: 'error' })
      return false
    }
    return true
  }

  const register = async () => {
    if (!validate()) return
    const res = await apiRegister(username, password, role)
    if (res.code === 200) {
      enqueueSnackbar('注册成功', { variant: 'success' })
      navigate('/auth/login')
    } else {
      console.warn('注册失败:', res)
      enqueueSnackbar(res.message, { variant: 'error' })
    }
  }

  return (
    <Box className="register-page">
      <Grid2 container
             size={12}
             rowSpacing='10px'
      >
        <Grid2 size={12}>
          <RadioGroup row value={role} onChange={(_e, value) => {setRole(+value)}}>
            <FormControlLabel value={UserRole.Student} control={<Radio />} label="学生注册" />
            <FormControlLabel value={UserRole.Shop} control={<Radio />} label="商户注册" />
          </RadioGroup>
        </Grid2>
        <Grid2 size={12}>
          <TextField
            className='input'
            variant='filled'
            value={username}
            // 不允许输入空格
            onChange={e => (e.nativeEvent as InputEvent).data?.trim() && setUsername(e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><AccountCircle/></InputAdornment>}}}
            label='用户名'
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            className='input'
            variant='filled'
            value={password}
            onChange={e => (e.nativeEvent as InputEvent).data?.trim() && setPassword(e.target.value) }
            type={'password'}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><LockOutlined/></InputAdornment>}}}
            label='密码'
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            className='input'
            variant='filled'
            value={confirmPassword}
            onChange={e => (e.nativeEvent as InputEvent).data?.trim() && setConfirmPassword(e.target.value)}
            type={'password'}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><Lock/></InputAdornment>}}}
            label='确认密码'
          />
        </Grid2>
        <Grid2 size={12}>
          <Button className='button' variant='contained' onClick={register}>注册</Button>
        </Grid2>
      </Grid2>
    </Box>
  )
}
