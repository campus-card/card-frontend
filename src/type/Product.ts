/**
 * 商家上架的商品信息
 */
export type Product = {
  id: number,
  shopId: number,
  name: string,
  description: string,
  price: number,
  store: number,
  // 总销售数量
  sales: number,
  uploadTime: string,
  modifyTime: string,
}

/**
 * 购买商品的记录信息. 学生和商家都可以用
 */
export type PurchaseRecord = {
  id: number,
  studentId: number,
  productId: number,
  shopId: number,
  price: number,
  // 购买数量
  amount: number,
  // 购买时间
  purchaseTime: string,
}
