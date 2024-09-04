import style from '@/view/home/index.module.scss'
import { Box, Container } from '@mui/material'
import { useAppSelector } from '@/redux/typing.ts'

export default function Home() {
  const userInfo = useAppSelector(state => state.user.userInfo)

  return (
    <Container disableGutters className={style.home}>
      <Box className={style.welcome} sx={{ color: 'text.primary' }}>欢迎您, {userInfo.username}</Box>
    </Container>
  )
}
