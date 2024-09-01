import { Product } from '@/type/Product.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'
import { Page } from '@/api/common.ts'
import Toast from '@/util/Toast.ts'

/**
 * 商家获取自己上传的商品列表 <br>
 * order: 1->按照上架时间排序, 2->价格排序, 3->库存排序
 */
export const apiGetProductList = async (page: number, pageSize: number, isAsc: number = 0, order: number = 1): Promise<Product[]> => {
  const { data } = await apiRequest.get('/shop/getProductList', {
    params: {
      page,
      pageSize,
      isAsc,
      order
    }
  })
  const res = data as DataResponse<Page<Product>>
  if (res.code === 200) {
    return res.data.data
  } else {
    console.warn('获取商品列表失败', res)
    Toast.error('获取商品列表失败')
    return []
  }
}
