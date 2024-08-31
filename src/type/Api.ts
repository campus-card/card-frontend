/**
 * 接口参数相关类型
 */
import { UserRole } from '@/type/User.ts'

export type DataResponse<T = any> = {
  code: number,
  message: string,
  data: T
}

export type LoginData = {
  id: number,
  username: string,
  role: UserRole,
  token: string,
  refreshToken: string
}
