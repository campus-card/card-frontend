/**
 * 校园卡类型
 */
export type CampusCard = {
  id: number,
  // 校园卡所属学生的用户id
  userId: number,
  cardId: number,
  balance: number,
  createTime: string
}
