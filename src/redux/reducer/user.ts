import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/type/User.ts'
import { createAppSelector } from '@/redux/typing.ts'
import { LoginData } from '@/type/Api.ts'
import { router } from '@/route'

// slice是reducer和action-creator的结合. 便于根据业务流程划分reducer
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userinfo: {
      id: 0,
      username: 'reisen',
      role: 1,
      registerTime: ''
    } as User,
    loginData: {} as LoginData
  },
  reducers: {
    setUserinfo: (state, action: PayloadAction<User>) => {
      state.userinfo = action.payload
    },
    setLoginData(state, action: PayloadAction<LoginData>) {
      state.loginData = action.payload
    },
    setToken(state, action: PayloadAction<string>) {
      state.loginData.token = action.payload
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.loginData.refreshToken = action.payload
    },
    logout: (state) => {
      state.loginData = {} as LoginData
      state.userinfo = {} as User
      // 登出之后直接刷新
      router.navigate('/auth')
        .then(() => location.reload())
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
      state => state.userinfo.role,
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

export const { setUserinfo, setLoginData, setToken, setRefreshToken, logout } = userSlice.actions
export const { token, refreshToken, roleLabel } = userSlice.selectors
export default userSlice.reducer
