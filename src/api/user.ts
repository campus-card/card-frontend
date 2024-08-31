import { User } from '@/type/User.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'
import { Placeholder } from '@/util/placeholder'

/**
 * 获取用户个人信息
 */
export const apiGetUserInfo = async (): Promise<User> => {
  const { data } = await apiRequest.get('/user/getUserInfo')
  const res = data as DataResponse<User>
  if (res.code === 200) {
    return res.data
  } else {
    console.warn('获取用户信息失败:', res)
    return Placeholder.User()
  }
}
