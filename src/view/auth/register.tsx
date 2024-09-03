import style from '@/view/auth/register.module.scss'
import { Box, Button, FormControlLabel, Grid2, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AccountCircle, Lock, LockOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { UserRole } from '@/type/User.ts'
import { apiRegister } from '@/api/auth.ts'
import Toast from '@/util/Toast.ts'

export default function Register() {
  const navigate = useNavigate()

  /* 表单 */
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [role, setRole] = useState<UserRole>(UserRole.Student)
  /* 校验 */
  const validate = () => {
    if (!username || !password || !confirmPassword) {
      Toast.error('输入不能为空')
      return false
    }
    // 检测空格
    if (/\s/.test(username + password + confirmPassword)) {
      Toast.error('输入不能包含空格')
      return false
    }
    if (username.length < 4 || username.length > 30) {
      Toast.error('用户名长度应在4-30之间')
      return false
    }
    if (password.length < 6) {
      Toast.error('密码长度不应小于6')
      return false
    }
    if (password !== confirmPassword) {
      Toast.error('两次密码不一致')
      return false
    }
    return true
  }

  const register = async () => {
    if (!validate()) return
    const res = await apiRegister(username, password, role)
    if (res.code === 200) {
      Toast.success('注册成功')
      navigate('/auth/login')
    } else {
      console.warn('注册失败:', res)
      Toast.error(res.message)
    }
  }

  return (
    <Box className={style.register}>
      <Grid2 container
             size={12}
             rowSpacing='10px'
      >
        <Grid2 size={12}>
          <RadioGroup row value={role} onChange={(_e, value) => {setRole(+value)}}>
            <FormControlLabel value={UserRole.Student} control={<Radio />} label={<Box sx={{ color: 'text.primary' }}>学生注册</Box>} />
            <FormControlLabel value={UserRole.Shop} control={<Radio />} label={<Box sx={{ color: 'text.primary' }}>商户注册</Box>} />
          </RadioGroup>
        </Grid2>
        <Grid2 size={12}>
          <TextField
            className={style.input}
            variant='filled'
            value={username}
            onChange={e => setUsername(e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><AccountCircle/></InputAdornment>}}}
            label='用户名'
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            className={style.input}
            variant='filled'
            value={password}
            onChange={e => setPassword(e.target.value)}
            type={'password'}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><LockOutlined/></InputAdornment>}}}
            label='密码'
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            className={style.input}
            variant='filled'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            type={'password'}
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><Lock/></InputAdornment>}}}
            label='确认密码'
          />
        </Grid2>
        <Grid2 size={12}>
          <Button className={style.button} variant='contained' onClick={register}>注册</Button>
        </Grid2>
      </Grid2>
    </Box>
  )
}
