/**
 * 用户
 */
export type User = {
  id: number,
  username: string,
  role: UserRole,
  registerTime: string
}

/**
 * 用户角色. 非const的enum可以反向映射[1] => 'Student'
 */
export enum UserRole {
  Student = 1,
  Shop = 2,
  Admin = 3
}
export enum UserRoleLabel {
  Student = '学生',
  Shop = '商家',
  Admin = '管理员'
}
