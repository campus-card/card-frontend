import style from './index.module.scss'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2, Pagination,
  Paper,
  Stack, SwipeableDrawer, TextField,
  Typography
} from '@mui/material'
import { ellipsis, formatDate } from '@/util/common.ts'
import { Category, CurrencyYen, Inventory, ShoppingCart, Warning } from '@mui/icons-material'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { Product } from '@/type/Product.ts'
import { apiAddProduct, apiDeleteProduct, apiGetProductList, apiModifyProduct } from '@/api/shop.ts'
import { Placeholder } from '@/util/placeholder.ts'
import Toast from '@/util/Toast.ts'

export default function Shop() {
  // 分页的数据部分和展示部分. 数据部分不涉及渲染所以useRef
  const productListData= useRef<Product[]>([])
  const [productList, setProductList] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const totalNum = useRef<number>(0)
  const pageSize = 9
  // 初始化商品列表第一页的数据
  const initListData = () => {
    setCurrentPage(1)
    productListData.current = []
    apiGetProductList(1, pageSize, productListData.current, true)
      .then(pageData => {
        setProductList(pageData.data)
        setTotalPage(pageData.pages)
        totalNum.current = pageData.total
      })
  }
  useEffect(initListData, [])
  const changePage = (_e: ChangeEvent<unknown>, page: number) => {
    (async () => {
      setCurrentPage(page)
      const pageData = await apiGetProductList(page, pageSize, productListData.current)
      setProductList(pageData.data)
    })()
  }

  // 修改商品的drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  // 当前修改的商品
  const [currentProduct, setCurrentProduct] = useState<Product>(Placeholder.Product())

  // 添加商品的modal
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  // 删除商品
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const deleteId = useRef<number>(0)
  const deleteProduct = async (id: number) => {
    const res = await apiDeleteProduct(id)
    if (res.code === 200) {
      Toast.warning('已删除商品')
      // 将数据列表中的对应数据删除
      productListData.current = productListData.current.filter(item => item.id !== id)
      totalNum.current -= 1
      // 重新获取当前页的数据
      const pageData = await apiGetProductList(currentPage, pageSize, productListData.current)
      setProductList(pageData.data)
      // 重新计算总页数
      if (totalNum.current % pageSize === 0) {
        setTotalPage(p => p - 1)
      }
      setOpenDeleteModal(false)
    } else {
      Toast.error(res.message)
      console.warn('删除失败', res)
    }
  }

  return (
    <Container disableGutters className={style.shop}>
      <Paper className={style.header}>
        <b>我上架的商品</b>
        <Button onClick={() => setOpenAddModal(true)} style={{ marginLeft: 'auto' }} variant={'contained'}>上架新商品</Button>
      </Paper>
      <Paper className={style.content}>
        <Grid2
          container
          spacing={2}
          columns={24}
          justifyContent={'center'}
        >
          {productList.map(product => {
            return (
              <Grid2 size={{ md: 12, lg: 8, xl: 8 }}  key={product.id}>
                <Card>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="https://picsum.photos/200"
                    title="图片仅供参考"
                  />
                  <CardContent sx={{ paddingBottom: 0 }}>
                    <Typography variant="h5" component="div">{product.name}</Typography>
                    <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>{ellipsis(product.description, 50)}</Typography>
                    <Typography variant={'caption'} gutterBottom sx={{ color: 'text.secondary' }}>
                      <div>上传时间: {product.uploadTime}</div>
                      <div>修改时间: {product.modifyTime}</div>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      <Stack direction={'row'} spacing={2}>
                        <span><ShoppingCart fontSize={'inherit'}/>单价: <CurrencyYen fontSize={ 'inherit' }/>{product.price}</span>
                        <span><Inventory fontSize={'inherit'}/>库存: {product.store}</span>
                      </Stack>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant={'contained'} onClick={() => {
                      setCurrentProduct(product)
                      setOpenDrawer(true)
                    }} size="small">修改</Button>
                    <Button variant={'contained'} color={'warning'} onClick={() => {
                      deleteId.current = product.id
                      setOpenDeleteModal(true)
                    }} size="small">删除</Button>
                  </CardActions>
                </Card>
              </Grid2>
            )
          })}
        </Grid2>
      </Paper>
      {/* 分页 */}
      <Paper className={style.pagination}>
        <Pagination onChange={changePage} page={currentPage} count={totalPage} color="primary" />
      </Paper>
      {/* 新增商品的modal */}
      <AddProduct open={openAddModal} setOpen={setOpenAddModal} refreshList={initListData} />
      {/* 修改商品的drawer */}
      <ModifyProduct open={openDrawer} product={currentProduct} setOpen={setOpenDrawer} updateList={setProductList}/>
      {/* 删除商品的确认modal */}
      <Dialog keepMounted open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle><Warning fontSize={'inherit'}/> 删除商品</DialogTitle>
        <DialogContent>
          <DialogContentText>是否确实要删除该商品?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} autoFocus>取消</Button>
          <Button onClick={() => deleteProduct(deleteId.current)} color={'error'} variant={'contained'}>确认删除</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

/**
 * 新增商品的modal
 */
const AddProduct = ({open, setOpen, refreshList}: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, refreshList: Function }) => {
  const addProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Product> = Object.fromEntries(formData.entries())
    if (!validateProduct(data)) return
    const res = await apiAddProduct(data.name!, data.description!, +data.price!, +data.store!)
    if (res.code === 200) {
      Toast.success('已上架商品')
      refreshList()
      setOpen(false)
    } else {
      Toast.error(res.message)
      console.warn('上架失败', res)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      keepMounted
      PaperProps={{ component: 'form', onSubmit: addProduct }}
    >
      <DialogTitle><Category fontSize={'inherit'}/> 上架新商品</DialogTitle>
      <DialogContent>
        <DialogContentText>请填写要添加的商品信息</DialogContentText>
        <TextField fullWidth name="name" label="商品名称" variant="standard"/>
        <TextField fullWidth name="description" label="商品介绍" variant="standard"/>
        <TextField fullWidth name="price" label="商品价格" type={'number'} variant="standard"/>
        <TextField fullWidth name="store" label="商品库存" type={'number'} variant="standard"/>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} color={'secondary'} onClick={() => setOpen(false)}>取消</Button>
        <Button variant={'contained'} type="submit">上架商品</Button>
      </DialogActions>
    </Dialog>
  )
}

/**
 * 修改商品信息的drawer
 */
const ModifyProduct = ({ product, setOpen, open, updateList }: {product: Product, setOpen: Dispatch<SetStateAction<boolean>>, open: boolean, updateList: Dispatch<SetStateAction<Product[]>>}) => {
  useEffect(() => {
    setForm({ name: product.name, description: product.description, price: product.price, store: product.store })
  }, [product])
  const [form, setForm] = useState<Partial<Product>>({
    name: product.name,
    description: product.description,
    price: product.price,
    store: product.store
  })
  const save = async () => {
    if (!validateProduct(form)) return
    // 遍历form, 如果和product中的值不同, 则修改
    const modifiedProps: Partial<Product> = {}
    if (form.name !== product.name) modifiedProps.name = form.name
    if (form.description !== product.description) modifiedProps.description = form.description
    if (form.price !== product.price) modifiedProps.price = form.price
    if (form.store !== product.store) modifiedProps.store = form.store
    const res = await apiModifyProduct(product.id, modifiedProps)
    if (res.code === 200) {
      Toast.success('修改成功')
      updateList(list => {
        const index = list.findIndex(item => item.id === product.id)
        list[index] = { ...list[index], ...modifiedProps, modifyTime: formatDate(new Date()) }
        return [...list]
      })
      setOpen(false)
    } else {
      Toast.error(res.message)
      console.warn('修改失败', res)
    }
  }
  const cancel = () => {
    console.log('取消修改')
    setForm(Placeholder.Product())
    setOpen(false)
  }

  return (
    <SwipeableDrawer
      open={open}
      anchor={'right'}
      keepMounted
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Box style={{ padding: '5px 10px', maxWidth: '40vw' }}>
      <Typography variant={'h6'} gutterBottom>
        <Paper style={{ padding: '10px', background: 'skyblue' }}>修改商品信息</Paper>
      </Typography>
      <Stack spacing={2}>
        <TextField label={'商品名称'} onChange={e => setForm({...form, name: e.target.value})} value={form.name} variant={'standard'} />
        <TextField label={'商品介绍'} onChange={e => setForm({...form, description: e.target.value})} value={form.description} multiline variant={'standard'} />
        <TextField label={'商品价格'} onChange={e => setForm({...form, price: +e.target.value})} value={form.price} variant={'standard'} type={'number'} />
        <TextField label={'商品库存'} onChange={e => setForm({...form, store: +e.target.value})} value={form.store} variant={'standard'} type={'number'} />
        <Typography variant={'h6'}>总销售量: {product.sales}</Typography>
        <Typography variant={'caption'}>上传时间: {product.uploadTime}</Typography>
        <Typography variant={'caption'}>最近修改时间: {product.modifyTime}</Typography>
        <Stack direction={'row'} spacing={2}>
          <Button onClick={save} variant={'contained'}>保存</Button>
          <Button onClick={cancel} variant={'contained'} color={'secondary'}>取消</Button>
        </Stack>
      </Stack>
    </Box>
    </SwipeableDrawer>
  )
}

/**
 * 校验商品信息
 */
const validateProduct = (product: Partial<Product>): boolean => {
  if (!product.name || !product.description || product.price === undefined || product.store === undefined) {
    Toast.warning('请填写完整的商品信息')
    return false
  }
  if (product.description.length < 10) {
    Toast.warning('商品介绍不能少于10个字')
    return false
  }
  if (product.price < 0 || product.store < 0) {
    Toast.warning('商品价格或库存不能为负数')
    return false
  }
  return true
}
