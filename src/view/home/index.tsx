import '@/view/home/index.scss'
import { token } from '@/redux/reducer/user'
import { useAppSelector } from '@/redux/typing.ts'

export default function Home() {

  const username = useAppSelector<string>(state => state.user.userinfo.username)
  const tokenStr = useAppSelector<string>(token)

  return (
    <div className="home">
      <h1>主页 {username}</h1>
      <div>token: { tokenStr }</div>
    </div>
  )
}
