import style from './index.module.scss'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container, Pagination,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { ellipsis } from '@/util/common.ts'
import { CurrencyYen, Inventory, ShoppingCart } from '@mui/icons-material'
import { ChangeEvent, useEffect, useState } from 'react'
import { Product } from '@/type/Product.ts'
import { apiGetProductList } from '@/api/shop.ts'

export default function Shop() {
  const [productList, setProductList] = useState<Product[]>([])
  useEffect(() => {
    // 获取商品列表
    (async () => {
      const list = await apiGetProductList(1, 5)
      setProductList(list)
    })()
  }, [])
  const changePage = (_e: ChangeEvent<unknown>, page: number) => {
    console.log('翻页了, 当前页码:', page)
  }

  return (
    <Container disableGutters className={style.shop}>
      <Paper className={style.header}>
        <div>我上架的商品</div>
      </Paper>
      <Paper className={style.content}>
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction={'row'}
          useFlexGap
          style={{ flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {productList.map(product => {
            return (
              <Card key={product.id} sx={{ maxWidth: 345, minWidth: 225 }}>
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
                      <span><ShoppingCart fontSize={ 'inherit' }/>单价: <CurrencyYen fontSize={ 'inherit' }/>{product.price}</span>
                      <span><Inventory fontSize={ 'inherit' }/>库存: {product.store}</span>
                    </Stack>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant={ 'contained' } size="small">修改</Button>
                  <Button variant={'contained'} color={'error'} size="small">删除</Button>
                </CardActions>
              </Card>
            )
          })}
        </Stack>
      </Paper>
      <Paper className={style.pagination}>
        <Pagination onChange={changePage} count={10} color="primary" />
      </Paper>
    </Container>
  )
}
