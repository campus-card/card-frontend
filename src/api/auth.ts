import { UserRole } from '@/type/User.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse, LoginData } from '@/type/Api.ts'

/**
 * 登录
 */
export const apiLogin = async (username: string, password: string, role: UserRole): Promise<DataResponse<LoginData>> => {
  const { data } = await apiRequest.postForm('/auth/login', {
    username,
    password,
    role
  })
  const res = data as DataResponse
  // 重命名accessToken为token
  if (res.code === 200) {
    res.data.token = res.data.accessToken
    delete res.data.accessToken
  }
  return res
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

/**
 * 刷新token, 用于自动登录
 */
export const apiRefresh = async (refreshToken: string): Promise<DataResponse<{token: string, refreshToken: string}>> => {
  const { data } = await apiRequest.postForm('/auth/refresh', { refreshToken })
  const res = data as DataResponse
  // 重命名accessToken为token
  if (res.code === 200) {
    res.data.token = res.data.accessToken
    delete res.data.accessToken
  }
  return res
}
