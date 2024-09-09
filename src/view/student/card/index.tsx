import style from './index.module.scss'
import {
  Avatar,
  Box, Button,
  Card as MuiCard,
  CardContent,
  CardHeader,
  Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem,
  Paper, TextField,
  Typography
} from '@mui/material'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { CurrencyYen, MoreVertOutlined, Security } from '@mui/icons-material'
import Toast from '@/util/Toast.ts'
import { apiGetCardInfo, apiRechargeCard, apiRegisterCard } from '@/api/student.ts'
import { useAppDispatch, useAppSelector } from '@/redux/typing.ts'
import { setCampusCard } from '@/redux/reducer/user.ts'
import { CampusCard } from '@/type/Student.ts'
import { User } from '@/type/User.ts'

export default function Card() {
  const dispatch = useAppDispatch()

  const cardInfo = useAppSelector<CampusCard>(state => state.user.campusCard)
  const userInfo = useAppSelector<User>(state => state.user.userInfo)

  useEffect(() => {
    (async () => {
      const res = await apiGetCardInfo()
      if (res.code === 200) {
        dispatch(setCampusCard(res.data))
      } else {
        console.warn('获取校园卡信息失败', res)
        // Toast.error(res.message)
      }
    })()
  }, [])

  // 充值的dialog
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [openRecharge, setOpenRecharge] = useState<boolean>(false)

  const [numberInput, setNumberInput] = useState<string>('')
  const recharge = async () => {
    if (!/^\d{1,10}(\.\d{0,2})?$/.test(numberInput)) {
      Toast.warning('充值金额最多有2位小数, 整数部分最多10位')
      return
    }
    const res = await apiRechargeCard(parseFloat(numberInput))
    if (res.code === 200) {
      Toast.success('充值成功')
      dispatch(setCampusCard({ balance: cardInfo.balance + parseFloat(numberInput) }))
      setOpenRecharge(false)
    } else {
      console.warn('充值失败', res)
      Toast.error(res.message)
    }
  }

  // 开通校园卡的dialog
  const [openRegisterCard, setOpenRegisterCard] = useState<boolean>(false)
  const registerCard = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const pwdForm = Object.fromEntries(new FormData(e.currentTarget).entries()) as { password: string, confirmPassword: string }
    if (!/^\d{6}$/.test(pwdForm.password)) {
      Toast.warning('支付密码必须为6位数字')
      return
    }
    if (pwdForm.password !== pwdForm.confirmPassword) {
      Toast.warning('两次输入的密码不一致')
      return
    }
    const res = await apiRegisterCard(pwdForm.password)
    if (res.code === 200) {
      Toast.success('已开通校园卡')
      setOpenRegisterCard(false)
      dispatch(setCampusCard(res.data))
    } else {
      console.warn('开通校园卡失败', res)
      Toast.error(res.message)
    }
  }

  return (
    <Container disableGutters className={style.card}>
      <Paper className={style.cardOverview}>
        <Typography gutterBottom variant="h5">我的校园卡</Typography>
        <Divider variant={'middle'} sx={{ mb: '15px' }}/>
        {cardInfo.id !== 0 &&
          <MuiCard raised className={ style.cardContent }>
            <CardHeader
              className={ style.cardHeader }
              title={ <span style={ { color: 'whitesmoke' } }>{ userInfo.username }</span> }
              subheader={ <span style={ { color: 'whitesmoke' } }>开通时间: { cardInfo.createTime }</span> }
              action={
                <IconButton ref={ anchorRef } onClick={ () => setOpen(true) } size={ 'large' }>
                  <MoreVertOutlined sx={ { color: 'whitesmoke' } }/>
                </IconButton>
              }
              avatar={ <Avatar sx={ { bgcolor: 'background.default' } }><Box
                sx={ { color: 'text.primary' } }>{ userInfo.username.toUpperCase().slice(0, 1) }</Box></Avatar> }
            />
            <CardContent className={ style.cardBody }>
              <Typography gutterBottom variant="body1" color="textSecondary" component="p">
                卡号: { cardInfo.cardId }
              </Typography>
              <Typography variant="body1" color="textSecondary" component="p">
                余额: { cardInfo.balance }
              </Typography>
            </CardContent>
            <Menu
              anchorEl={ anchorRef.current }
              anchorOrigin={ { vertical: 'bottom', horizontal: 'right' } }
              transformOrigin={ { vertical: 'top', horizontal: 'right' } }
              keepMounted
              open={ open }
              onClose={ () => setOpen(false) }
            >
              <MenuItem onClick={ () => {
                setOpenRecharge(true)
                setOpen(false)
              } }>
                <ListItemIcon><CurrencyYen/></ListItemIcon>余额充值
              </MenuItem>
            </Menu>
          </MuiCard>
        }
        {cardInfo.id === 0 &&
          <Typography variant="body1" color="textSecondary" component="p">
            暂未开通校园卡, <Button variant={'text'} sx={{ fontSize: 'inherit', fontWeight: 'bold' }} onClick={() => setOpenRegisterCard(true)}>点击开通</Button>
          </Typography>
        }
      </Paper>
      {/* 开通校园卡的dialog */}
      <Dialog
        open={openRegisterCard}
        onClose={() => setOpenRegisterCard(false)}
        keepMounted
        PaperProps={{ component: 'form', onSubmit: registerCard }}
      >
        <DialogTitle>开通校园卡</DialogTitle>
        <DialogContent>
          <DialogContentText>请指定支付密码(6位数字)</DialogContentText>
          <TextField
            type={'password'}
            variant={'standard'}
            name={'password'}
            label={'支付密码'}
            fullWidth
            slotProps={{ input: { endAdornment: <InputAdornment position={'end'}><Security/></InputAdornment>} }}
          />
          <TextField
            type={'password'}
            variant={'standard'}
            name={'confirmPassword'}
            label={'确认支付密码'}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color={'secondary'} onClick={() => setOpenRegisterCard(false)}>取消</Button>
          <Button variant="contained" type={'submit'}>确认开通</Button>
        </DialogActions>
      </Dialog>
      {/* 校园卡充值的dialog */}
      <Dialog
        open={openRecharge}
        onClose={(_event, reason) => reason === 'escapeKeyDown' && setOpenRecharge(false)}
        keepMounted
      >
        <DialogTitle><CurrencyYen fontSize="inherit" /> 校园卡充值</DialogTitle>
        <DialogContent>
          <DialogContentText>请输入充值金额</DialogContentText>
          <TextField
            value={numberInput}
            type={'number'}
            onChange={e => setNumberInput(e.target.value)}
            name="amount"
            fullWidth
            label={'充值金额'}
            variant={'standard'}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color={'secondary'} onClick={() => setOpenRecharge(false)}>取消</Button>
          <Button variant="contained" onClick={recharge}>确认充值</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
