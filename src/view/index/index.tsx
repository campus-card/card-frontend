import '@/view/index/index.scss'
import { Button } from '@mui/material'
import { FC, useRef, useState } from 'react'

export default function Index() {

  let number = useRef<number>(1)
  const test = () => {
    number.current++
    console.log('number = ', number.current)
  }

  const [num, setNum] = useState<number>(1)
  const test1 = () => {
    setNum(num => num + 1)
    setNum(num => num + 1)
  }

  return (
    <div className="index">
      <Test />
      <h1>Index Page</h1>
      <Button onClick={test} variant="contained">测试{number.current}</Button>
      <Button onClick={test1} variant="contained">测试重新渲染{num}</Button>
    </div>
  )
}

const Test: FC = () => (
  <div>123</div>
)
