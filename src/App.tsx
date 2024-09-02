import { createContext, Suspense, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/route'
import { createTheme, ThemeProvider } from '@mui/material'

const darkTheme = createTheme({
  palette: { mode: 'dark' }
})
const lightTheme = createTheme({
  palette: { mode: 'light' }
})
export const ThemeContext = createContext(null)

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    // @ts-ignore
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
