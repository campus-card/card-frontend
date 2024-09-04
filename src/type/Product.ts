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
  // 购买时的商品单价
  price: number,
  // 花费金额
  amount: number,
  // 购买数量
  count: number
  // 购买后剩余库存
  store: number
  // 购买时间
  purchaseTime: string,
  productName: string,
  // 购买的商品所属商家名称
  shopName: string,
  // 购买的学生的名称
  studentName: string
}
