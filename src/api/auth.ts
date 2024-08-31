import { UserRole } from '@/type/User.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse, LoginData } from '@/type/Api.ts'

/**
 * 登录
 */
export const apiLogin = async (username: string, password: string, role: UserRole): Promise<DataResponse<LoginData>> => {
  const res = await apiRequest.postForm('/auth/login', {
    username,
    password,
    role
  })
  return res.data
}

/**
 * 注册
 */
export const apiRegister = async (username: string, password: string, role: UserRole): Promise<DataResponse> => {
  const res = await apiRequest.postForm('/auth/signUp', {
    username,
    password,
    role
  })
  return res.data
}
