import { User } from '@/type/User.ts'
import { Product } from '@/type/Product.ts'
import { CampusCard } from '@/type/Student.ts'

/**
 * 一些类型的空占位数据
 */
export const Placeholder = {
  User: () => ({
    id: 0,
    username: '',
    role: 1,
    registerTime: ''
  }) as User,
  Product: () => ({
    id: 0,
    shopId: 0,
    name: '',
    description: '',
    price: 0,
    store: 0,
    uploadTime: '',
    modifyTime: ''
  }) as Product,
  CampusCard: () => ({
    id: 0,
    cardId: 0,
    userId: 0,
    balance: 0,
    createTime: ''
  }) as CampusCard
}
