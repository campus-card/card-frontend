import { CampusCard } from '@/type/Student.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'
import { Product, PurchaseRecord } from '@/type/Product.ts'
import { Page } from '@/api/common.ts'
import { spliceWithPlaceholder } from '@/util/common.ts'
import Toast from '@/util/Toast.ts'
/**
 * 学生相关接口
 */

/**
 * 学生开通校园卡
 */
export const apiRegisterCard = async (password: string): Promise<DataResponse<CampusCard>> => {
  const { data } = await apiRequest.postForm('/student/registerCard', {
    password
  })
  return data as DataResponse<CampusCard>
}

/**
 * 学生获取校园卡信息(查询余额)
 */
export const apiGetCardInfo = async (): Promise<DataResponse<CampusCard>> => {
  const { data } = await apiRequest.get('/student/getCardInfo')
  return data as DataResponse<CampusCard>
}

/**
 * 学生充值校园卡
 */
export const apiRechargeCard = async (amount: number): Promise<DataResponse> => {
  const { data } = await apiRequest.postForm('/student/recharge', {
    amount
  })
  return data as DataResponse
}

/**
 * 学生获取商品列表
 */
export const apiGetStuProductList = async (page: number, pageSize: number, dataList: Product[], force: boolean = false, isAsc: number = 0, order: number = 1): Promise<Page<Product>> => {
  if (!force) {
    const targetPage = dataList.slice((page - 1) * pageSize, page * pageSize)
    if (targetPage.filter(item => item).length === pageSize) {
      return { data: targetPage } as Page<Product>
    }
  }
  const { data } = await apiRequest.get('/student/getProductList', {
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
    Toast.error(res.message)
    return { data: [] } as unknown as Page<Product>
  }
}

/**
 * 学生消费, 购买商品
 */
export const apiPurchase = async (productId: number, count: number, password: string): Promise<DataResponse<CampusCard>> => {
  const { data } = await apiRequest.postForm('/student/purchase', {
    productId,
    count,
    password
  })
  return data as DataResponse<CampusCard>
}

/**
 * 学生查询校园卡消费记录
 */
export const apiGetPurchaseRecord = async (page: number, pageSize: number, dataList: PurchaseRecord[], force: boolean = false): Promise<Page<PurchaseRecord>> => {
  if (!force) {
    const targetPage = dataList.slice((page - 1) * pageSize, page * pageSize)
    if (targetPage.filter(item => item).length === pageSize) {
      return { data: targetPage } as Page<PurchaseRecord>
    }
  }
  const { data } = await apiRequest.get('/student/getPurchaseRecord', {
    params: {
      page,
      pageSize
    }
  })
  const res = data as DataResponse<Page<PurchaseRecord>>
  if (res.code === 200) {
    spliceWithPlaceholder(dataList, (page - 1) * pageSize, pageSize, ...res.data.data)
    return res.data
  } else {
    console.warn('获取消费记录失败', res)
    Toast.error(res.message)
    return { data: [] } as unknown as Page<PurchaseRecord>
  }
}
