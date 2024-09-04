import style from './index.module.scss'
import { Container } from '@mui/material'

export default function Purchase() {

  return (
    <Container disableGutters className={style.purchase}>
      购买商品
    </Container>
  )
}
