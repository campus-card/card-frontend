import style from '@/view/auth/index.module.scss'
import { Box, Container } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { apiRefresh } from '@/api/auth.ts'
import { useAppDispatch, useAppSelector } from '@/redux/typing.ts'
import { clearLoginData, refreshToken, setLoginData } from '@/redux/reducer/user.ts'
import Toast from '@/util/Toast.ts'

export default function Auth() {
  // 尝试自动登录
  const refresh = useAppSelector<string>(refreshToken)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      if (!refresh) return
      const res = await apiRefresh(refresh)
      if (res.code === 200) {
        dispatch(setLoginData(res.data))
        Toast.success('[自动登录] 欢迎回来~')
        navigate('/index/home')
      } else {
        // 自动登录失败, 清除登录信息
        console.warn('自动登录失败', res)
        dispatch(clearLoginData())
      }
    })()
  }, [])

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Container className={style.auth}>
        <div className={style.appTitle}>校园卡消费系统</div>
        {/* 二级路由 */}
        <Outlet />
      </Container>
    </Box>
  )
}
