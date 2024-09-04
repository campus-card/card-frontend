import style from './index.module.scss'
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog, DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  Divider,
  Grid2,
  Paper, TextField,
  Typography
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/typing.ts'
import { User } from '@/type/User.ts'
import { FormEvent, useState } from 'react'
import { EditNote } from '@mui/icons-material'
import Toast from '@/util/Toast.ts'
import { apiUpdateUserInfo } from '@/api/user.ts'
import { roleLabel, setUserInfo } from '@/redux/reducer/user.ts'

export default function UserInfo() {
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector<User>(state => state.user.userInfo)
  const roleLabelStr = useAppSelector(roleLabel)

  const [open, setOpen] = useState<boolean>(false)
  const updateUserInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<User> = Object.fromEntries(formData.entries())
    if (!data.username) {
      Toast.warning('用户名不能为空')
      return
    }
    if (data.username === userInfo.username) {
      Toast.warning('用户名没有变化')
      return
    }
    if (/\s/.test(data.username)) {
      Toast.error('用户名不能包含空格')
      return
    }
    if (data.username.length < 4 || data.username.length > 30) {
      Toast.error('用户名长度应在4-30之间')
      return false
    }
    const res = await apiUpdateUserInfo(data.username)
    if (res.code === 200) {
      Toast.success('修改成功')
      dispatch(setUserInfo({ ...userInfo, ...data }))
      setOpen(false)
    } else {
      Toast.error(res.message)
    }
  }

  return (
    <Container disableGutters className={style.userInfo}>
      <Paper className={style.overview}>
        <Typography gutterBottom variant={'h5'}><b>基本信息</b></Typography>
        <Divider variant={'middle'} sx={{ mb: '10px' }}/>
        <Grid2 container columns={24}>
          <Grid2 container size={24}>
            <Grid2 size={10}>
              <Box className={style.tar}><b>用户名</b></Box>
            </Grid2>
            <Grid2 offset={1} size={13}>
              <Box>
                <span style={{ marginRight: '10px' }}>{ userInfo.username }</span>
                <Chip label={roleLabelStr} variant={'outlined'} />
              </Box>
            </Grid2>
          </Grid2>
          <Divider variant={'middle'} sx={{ mb: '10px' }}/>
          <Grid2 container size={24}>
            <Grid2 className={style.tar} size={10}>
              <Box><b>注册时间</b></Box>
            </Grid2>
            <Grid2 offset={1} size={13}>
              <Box>{ userInfo.registerTime }</Box>
            </Grid2>
          </Grid2>
          <Divider variant={'middle'} sx={{ mb: '10px' }}/>
          <Grid2 container size={24}>
            <Grid2 offset={11}>
              <Button variant={'contained'} onClick={() => setOpen(true)}>修改信息</Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Paper>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        keepMounted
        PaperProps={{ component: 'form', onSubmit: updateUserInfo }}
      >
        <DialogTitle><EditNote fontSize={"inherit"} />修改用户信息</DialogTitle>
        <DialogContent>
          <DialogContentText>设置需要修改的用户信息</DialogContentText>
          <TextField fullWidth name="username" label="用户名称" variant={"standard"} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color={'secondary'} onClick={() => setOpen(false)}>取消</Button>
          <Button variant="contained" type="submit">确定</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
