import { Product } from '@/type/Product.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'
import { Page } from '@/api/common.ts'
import Toast from '@/util/Toast.ts'
import { spliceWithPlaceholder } from '@/util/common.ts'

/**
 * 商家上传商品
 */
export const apiAddProduct = async (name: string, description: string, price: number, store: number): Promise<DataResponse> => {
  const { data } = await apiRequest.postForm('/shop/addProduct', {
    name,
    description,
    price,
    store
  })
  return data
}

/**
 * 商家获取自己上传的商品列表 <br>
 * order: 1->按照上架时间排序, 2->价格排序, 3->库存排序
 */
export const apiGetProductList = async (page: number, pageSize: number, dataList: Product[], force: boolean = false, isAsc: number = 0, order: number = 1): Promise<Page<Product>> => {
  if (!force) {
    const targetPage = dataList.slice((page - 1) * pageSize, page * pageSize)
    if (targetPage.filter(item => item).length === pageSize) {
      return { data: targetPage } as Page<Product>
    }
  }

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
    spliceWithPlaceholder(dataList, (page - 1) * pageSize, pageSize, ...res.data.data)
    return res.data
  } else {
    console.warn('获取商品列表失败', res)
    Toast.error('获取商品列表失败')
    return { data: [] } as unknown as Page<Product>
  }
}

/**
 * 商家修改商品信息, 只更新修改了的字段
 */
export const apiModifyProduct = async (productId: number, modifiedProps: Partial<Product>): Promise<DataResponse> => {
  const { data } = await apiRequest.patchForm('/shop/modifyProduct', {
    id: productId,
    ...modifiedProps
  })
  return data
}

/**
 * 商家删除商品
 */
export const apiDeleteProduct = async (productId: number): Promise<DataResponse> => {
  const { data } = await apiRequest.delete('/shop/deleteProduct', {
    params: {
      id: productId
    }
  })
  return data
}
