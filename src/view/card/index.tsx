import style from './index.module.scss'
import { Card as MuiCard, Container, Divider, Paper, Typography } from '@mui/material'

export default function Card() {
  return (
    <Container disableGutters className={style.card}>
      <Paper className={style.cardOverview}>
        <Typography gutterBottom variant="h5">我的校园卡</Typography>
        <Divider variant={'middle'} />
        <MuiCard raised>
          123
        </MuiCard>
      </Paper>
    </Container>
  )
}
