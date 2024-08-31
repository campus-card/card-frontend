import { UserRole } from '@/type/User.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse, LoginData } from '@/type/Api.ts'

export const apiLogin = async (username: string, password: string, role: UserRole): Promise<DataResponse<LoginData>> => {
  const res = await apiRequest.postForm('/auth/login', {
    username,
    password,
    role
  })
  return res.data
}
