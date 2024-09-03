import style from './index.module.scss'
import { useContext } from 'react'
import { ThemeContext } from '@/App.tsx'
import { Box, Container, Divider, Grid2, Paper, Switch, Typography } from '@mui/material'
import { useAppDispatch } from '@/redux/typing.ts'
import { setThemePreference } from '@/redux/reducer/user.ts'

export default function Setting() {
  // @ts-ignore
  const { theme, setTheme } = useContext(ThemeContext)
  const dispatch = useAppDispatch()
  const switchTheme = () => {
    setTheme((theme: 'light' |'dark') => {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      // 将主题偏好存入redux
      dispatch(setThemePreference(newTheme))
      return newTheme
    })
  }

  return (
    <Container disableGutters className={style.setting}>
      <Paper className={style.overview}>
        <Typography gutterBottom variant={'h5'}><b>系统设置</b></Typography>
        <Divider variant={'middle'} sx={{ mb: '10px' }}/>
        <Grid2 container columns={24}>
          <Grid2 container size={24}>
            <Grid2 size={10} className={style.flexR}>
              <Box>深色模式</Box>
            </Grid2>
            <Grid2 offset={1} size={13}>
              <Switch checked={theme === 'dark'} onChange={switchTheme}/>
            </Grid2>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  )
}
