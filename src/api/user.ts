import { User } from '@/type/User.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'

/**
 * 获取用户个人信息
 */
export const apiGetUserInfo = async (): Promise<DataResponse<User>> => {
  const { data } = await apiRequest.get('/user/getUserInfo')
  return data
}
