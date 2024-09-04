import { CampusCard } from '@/type/Student.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'
import { PurchaseRecord } from '@/type/Product.ts'
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
 * 学生消费, 购买商品
 */
export const apiPurchase = async (productId: number, count: number): Promise<DataResponse<CampusCard>> => {
  const { data } = await apiRequest.postForm('/student/purchase', {
    productId,
    count
  })
  return data as DataResponse<CampusCard>
}

/**
 * 学生查询校园卡消费记录
 */
export const apiGetPurchaseRecord = async (page: number, pageSize: number): Promise<DataResponse<PurchaseRecord[]>> => {
  const { data } = await apiRequest.get('/student/getPurchaseRecord', {
    params: {
      page,
      pageSize
    }
  })
  return data as DataResponse<PurchaseRecord[]>
}
