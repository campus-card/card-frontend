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
import { MonetizationOn } from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react'
import { PurchaseRecord } from '@/type/Product.ts'
import { apiGetSaleRecord } from '@/api/shop.ts'

export default function SaleRecord() {

  const recordListData = useRef<PurchaseRecord[]>([])
  const [recordList, setRecordList] = useState<PurchaseRecord[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const totalNum = useRef<number>(0)
  const pageSize = 9
  // 初始化销售记录第一页的数据
  useEffect(() => {
    setCurrentPage(1)
    apiGetSaleRecord(1, pageSize, recordListData.current)
      .then(recordPage => {
        setRecordList(recordPage.data)
        setTotalPage(recordPage.pages)
        totalNum.current = recordPage.total
      })
  }, [])
  const changePage = (_e: unknown, page: number) => {
    setCurrentPage(page)
    apiGetSaleRecord(page, pageSize, recordListData.current)
      .then(recordPage => {
        setRecordList(recordPage.data)
      })
  }

  return (
    <Container disableGutters className={style.saleRecord}>
      <Paper className={style.header}>商品销售记录</Paper>
      <Card className={style.content} variant={'outlined'}>
        <List>
          {recordList.map(record => (
            <ListItem
              key={record.id}
              divider
              alignItems={'flex-start'}
              secondaryAction={
                <ListItemText
                  primary={<Typography sx={{ textAlign: 'right' }}>交易金额: <Chip color={'success'} label={`￥${record.amount}`} component="span"/></Typography>}
                  secondary={
                    <Stack component="span" direction={'row'} alignItems={'center'} spacing={1} sx={{ mt: '5px' }}>
                      <Box component="span">购买数量: <Chip label={record.count} component="span"/></Box>
                      <Box component="span">剩余库存: <Chip label={record.store} component="span"/></Box>
                      <Box component="span">单价: <Chip label={record.price} component="span"/></Box>
                      <Box component="span">时间: <Chip label={record.purchaseTime} component="span"/></Box>
                    </Stack>
                  }
                />
              }
            >
              <ListItemAvatar>
                <Avatar><MonetizationOn/></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={record.productName || '商品已下架'}
                secondary={<Typography>消费人: {record.studentName}</Typography>}
              />
            </ListItem>
          ))}
          {recordList.length === 0 && <ListItem><ListItemText secondary={'暂无数据...'}/></ListItem>}
        </List>
      </Card>
      <Paper className={style.pagination}>
        <Pagination onChange={changePage} page={currentPage} count={totalPage} color="primary" />
      </Paper>
    </Container>
  )
}
