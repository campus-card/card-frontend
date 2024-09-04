import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/type/User.ts'
import { createAppSelector } from '@/redux/typing.ts'
import { LoginData } from '@/type/Api.ts'
import { router } from '@/route'
import { Placeholder } from '@/util/placeholder.ts'
import { CampusCard } from '@/type/Student.ts'

// slice是reducer和action-creator的结合. 便于根据业务流程划分reducer
const userSlice = createSlice({
  // slice的名称, 会成为state的key, 访问时使用state.user
  name: 'user',
  initialState: {
    userInfo: Placeholder.User(),
    loginData: {} as LoginData,
    campusCard: Placeholder.CampusCard(),
    themePreference: 'light' as 'light' | 'dark'
  },
  reducers: {
    setUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      // 支持部分更新/删除. 删除时payload对应字段设为undefined
      state.userInfo = { ...state.userInfo, ...action.payload }
    },
    setLoginData(state, action: PayloadAction<Partial<LoginData>>) {
      state.loginData = { ...state.loginData, ...action.payload }
    },
    setCampusCard: (state, action: PayloadAction<Partial<CampusCard>>) => {
      state.campusCard = { ...state.campusCard, ...action.payload }
    },
    clearLoginData: (state) => {
      state.loginData = {} as LoginData
    },
    logout: (state) => {
      // 清楚登录信息和用户信息
      state.loginData = {} as LoginData
      state.userInfo = {} as User
      // 登出之后直接刷新
      router.navigate('/auth')
        .then(() => location.reload())
    },
    setThemePreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themePreference = action.payload
    }
  },
  // selectors可看做计算属性
  // 需要配合useSelector使用
  selectors: {
    token: state => state.loginData.token,
    refreshToken: state => state.loginData.refreshToken,
    // 使用createSelector可以进行更复杂的操作, 比如根据多个inputSelector的结果进行计算
    // 并能缓存计算结果
    // https://www.reduxjs.cn/usage/deriving-data-selectors/#createselector-%E6%A6%82%E8%BF%B0
    roleLabel: createAppSelector(
      // inputSelectors, 可以有多个(数组)
      state => state.userInfo.role,
      // result/outputSelector
      role => {
        switch (role) {
          case 1:
            return '学生'
          case 2:
            return '商家'
          case 3:
            return '管理员'
        }
      }
    )
  }
})

export const {
  setUserInfo, setLoginData, clearLoginData, logout, setThemePreference,
  setCampusCard
} = userSlice.actions

export const { token, refreshToken, roleLabel } = userSlice.selectors
export default userSlice.reducer
