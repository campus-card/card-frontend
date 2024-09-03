import style from './index.module.scss'
import { Box, Container } from '@mui/material'

export default function Card() {
  return (
    <Container disableGutters className={style.card}>
      <Box>校园卡管理</Box>
    </Container>
  )
}
