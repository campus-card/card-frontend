import { createContext, Suspense, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/route'
import { createTheme, ThemeProvider } from '@mui/material'
import { useAppSelector } from '@/redux/typing.ts'

const darkTheme = createTheme({
  palette: { mode: 'dark' }
})
const lightTheme = createTheme({
  palette: { mode: 'light' }
})
// 主题颜色的上下文对象, 包含主体颜色的state及其setter, 在子组件中使用
export const ThemeContext = createContext(null)

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const themePref = useAppSelector(state => state.user.themePreference)
  useEffect(() => {
    setTheme(themePref)
  }, [])

  return (
    // @ts-ignore
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <Suspense>
          {/* 定义future属性对象, 关闭react router v7的警告 */}
          <RouterProvider router={router}
                          future={{ v7_startTransition: true }} />
        </Suspense>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
