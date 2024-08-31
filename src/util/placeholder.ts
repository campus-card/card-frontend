import { User } from '@/type/User.ts'

/**
 * 一些类型的空占位数据
 */
export const Placeholder = {
  User: () => ({
    id: 0,
    username: '',
    role: 1,
    registerTime: ''
  }) as User
}
