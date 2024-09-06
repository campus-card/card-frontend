import style from './index.module.scss'
import {
  Avatar,
  Box,
  Card,
  Chip,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText, Pagination,
  Paper,
  Stack, Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import type { PurchaseRecord } from '@/type/Product.ts'
import { MonetizationOn } from '@mui/icons-material'
import { apiGetPurchaseRecord } from '@/api/student.ts'

export default function PurchaseRecord() {

  const billListData = useRef<PurchaseRecord[]>([])
  const [billList, setBillList] = useState<PurchaseRecord[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const totalNum = useRef<number>(0)
  const pageSize = 9
  // 初始化销售记录第一页的数据
  useEffect(() => {
    setCurrentPage(1)
    apiGetPurchaseRecord(1, pageSize, billListData.current)
      .then(recordPage => {
        setBillList(recordPage.data)
        setTotalPage(recordPage.pages)
        totalNum.current = recordPage.total
      })
  }, [])
  const changePage = (_e: unknown, page: number) => {
    setCurrentPage(page)
    apiGetPurchaseRecord(page, pageSize, billListData.current)
      .then(recordPage => {
        setBillList(recordPage.data)
      })
  }

  return (
    <Container disableGutters className={style.purchaseRecord}>
      <Paper className={style.header}>购买商品记录</Paper>
      <Card className={style.content} variant={'outlined'}>
        <List>
          {billList.map(bill => (
            <ListItem
              key={bill.id}
              divider
              alignItems={'flex-start'}
              secondaryAction={
                <ListItemText
                  /* Chip, Stack默认是div类型的, 插入到这里会报错说div不能是p的子元素, 所以改为span */
                  primary={<Typography sx={{ textAlign: 'right' }}>消费金额: <Chip component="span" color={'warning'} label={`￥ -${bill.amount}`}/></Typography>}
                  secondary={
                    <Stack component="span" direction={'row'} alignItems={'center'} spacing={1} sx={{ mt: '5px' }}>
                      <Box component="span">购买数量: <Chip label={bill.count} component="span"/></Box>
                      <Box component="span">单价: <Chip label={bill.price} component="span"/></Box>
                      <Box component="span">时间: <Chip label={bill.purchaseTime} component="span"/></Box>
                    </Stack>
                  }
                />
              }
            >
              <ListItemAvatar>
                <Avatar><MonetizationOn/></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={bill.productName || '商品已下架'}
                secondary={<Typography>商家: {bill.shopName}</Typography>}
              />
            </ListItem>
          ))}
          {billList.length === 0 && <ListItem><ListItemText secondary={'暂无数据...'}/></ListItem>}
        </List>
      </Card>
      <Paper className={style.pagination}>
        <Pagination onChange={changePage} page={currentPage} count={totalPage} color="primary" />
      </Paper>
    </Container>
  )
}
