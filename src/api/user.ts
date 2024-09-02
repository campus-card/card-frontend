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

/**
 * 修改用户信息, 目前只支持修改用户名
 */
export const apiUpdateUserInfo = async (username: string): Promise<DataResponse> => {
  const { data } = await apiRequest.patchForm('/user/updateUserInfo', {
    username
  })
  return data
}
