import style from './index.module.scss'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { ellipsis } from '@/util/common.ts'
import { CurrencyYen, Inventory, Security, ShoppingCart, ViewModule } from '@mui/icons-material'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Product } from '@/type/Product.ts'
import { Placeholder } from '@/util/placeholder.ts'
import { apiGetCardInfo, apiGetStuProductList, apiPurchase } from '@/api/student.ts'
import Toast from '@/util/Toast.ts'
import { useAppDispatch } from '@/redux/typing.ts'
import { setCampusCard } from '@/redux/reducer/user.ts'

export default function Purchase() {
  const dispatch = useAppDispatch()

  const productListData = useRef<Product[]>([])
  const [productList, setProductList] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const totalNum = useRef<number>(0)
  const pageSize = 9

  // 初始化商品列表第一页的数据
  useEffect(() => {
    setCurrentPage(1)
    productListData.current = []
    apiGetStuProductList(1, pageSize, productListData.current, true)
      .then(pageData => {
        setProductList(pageData.data)
        setTotalPage(pageData.pages)
        totalNum.current = pageData.total
      })
  }, [])
  const changePage = (_e: ChangeEvent<unknown>, page: number) => {
    (async () => {
      setCurrentPage(page)
      const pageData = await apiGetStuProductList(page, pageSize, productListData.current)
      setProductList(pageData.data)
    })()
  }

  // 重置dialog输入信息的按钮ref
  const resetRef = useRef<HTMLButtonElement>(null)

  // 购买商品
  const [currentProduct, setCurrentProduct] = useState<Product>(Placeholder.Product())
  const [openPurchase, setOpenPurchase] = useState<boolean>(false)
  const purchase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const purchaseForm = Object.fromEntries(new FormData(e.currentTarget).entries()) as {
      password: string,
      count: string
    }
    if (!/^\d{6}$/.test(purchaseForm.password)) {
      Toast.warning('支付密码必须为6位数字')
      return
    }
    const count: number = parseInt(purchaseForm.count)
    if (count <= 0 || count > currentProduct.store) {
      Toast.warning('购买数量不能小于0或超过库存')
      return
    }
    const res = await apiPurchase(currentProduct.id, count, purchaseForm.password)
    if (res.code === 200) {
      Toast.success('购买成功')
      // 更新store中的余额信息
      const res = await apiGetCardInfo()
      if (res.code === 200) {
        dispatch(setCampusCard(res.data))
      } else {
        Toast.error(res.message)
        console.warn('获取校园卡信息失败', res)
      }
      // 对应商品的数量减少
      const index = productList.findIndex(product => product.id === currentProduct.id)
      productList[index].store -= count
      setProductList([...productList])
      setOpenPurchase(false)
      resetRef.current?.click()
    } else {
      console.warn('购买失败', res)
      Toast.error(res.message)
    }
  }

  return (
    <Container disableGutters className={style.purchase}>
      <Paper className={style.header}>购买商品</Paper>
      <Paper className={style.content}>
        <Grid2
          container
          spacing={2}
          columns={24}
          justifyContent={'center'}
        >
          {productList.map(product => {
            return (
              <Grid2 size={{md: 12, lg: 8, xl: 8}} key={product.id}>
                <Card>
                  <CardMedia
                    sx={{height: 140}}
                    image={product.coverUrl}
                    title="图片仅供参考"
                  />
                  <CardContent sx={{paddingBottom: 0}}>
                    <Typography variant="h5" component="div">{product.name}</Typography>
                    <Typography variant="body2" gutterBottom
                                sx={{color: 'text.secondary'}}>{ellipsis(product.description, 50)}</Typography>
                    <Typography variant={'caption'} gutterBottom sx={{color: 'text.secondary'}}>
                      <div>上架时间: {product.uploadTime}</div>
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                      <Stack direction={'row'} spacing={2}>
                        <span><ShoppingCart fontSize={'inherit'}/>价格: <CurrencyYen
                          fontSize={'inherit'}/>{product.price}</span>
                        <span><Inventory fontSize={'inherit'}/>库存: {product.store}</span>
                      </Stack>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant={'contained'} onClick={() => {
                      setCurrentProduct(product)
                      setOpenPurchase(true)
                    }} size="small">购买</Button>
                  </CardActions>
                </Card>
              </Grid2>
            )
          })}
        </Grid2>
      </Paper>
      {/* 分页 */}
      <Paper className={style.pagination}>
        <Pagination onChange={changePage} page={currentPage} count={totalPage} color="primary"/>
      </Paper>
      {/* 开通校园卡的dialog */}
      <Dialog
        open={openPurchase}
        onClose={() => setOpenPurchase(false)}
        keepMounted
        PaperProps={{component: 'form', onSubmit: purchase}}
      >
        <DialogTitle>购买商品: {currentProduct.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>请确认购买信息</DialogContentText>
          <TextField
            variant={'standard'}
            name={'count'}
            label={'购买数量'}
            type={'number'}
            defaultValue={1}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position={'end'}>/ {currentProduct.store}<ViewModule/></InputAdornment>
              }
            }}
            fullWidth
          />
          <TextField
            type={'password'}
            variant={'standard'}
            name={'password'}
            label={'支付密码'}
            slotProps={{input: {endAdornment: <InputAdornment position={'end'}><Security/></InputAdornment>}}}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant={'text'} type={'reset'} ref={resetRef}>重置</Button>
          <Button variant="contained" color={'secondary'} onClick={() => {
            setOpenPurchase(false)
            resetRef.current?.click()
          }}>取消</Button>
          <Button variant="contained" type={'submit'}>确认购买</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
