// 用户分享的图片的类型
export type Image = {
  id: number
  userId: number
  title: string
  description: string
  browse: number
  likes: number
  imageUrl: string
  categories: Category[]
}

export type Category = {
  id: number,
  name: string,
  selected?: boolean
}
