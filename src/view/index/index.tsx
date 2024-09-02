import style from '@/view/index/index.module.scss'
import {
  AppBar,
  Box,
  ClickAwayListener, Container,
  Divider,
  Grid2,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AccountBox,
  AccountCircle,
  CreditCard,
  Home,
  LocalShippingOutlined,
  Logout,
  Settings
} from '@mui/icons-material'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/typing.ts'
import { logout, setUserinfo } from '@/redux/reducer/user.ts'
import store from '@/redux'
import { User, UserRole } from '@/type/User.ts'
import { apiGetUserInfo } from '@/api/user.ts'
import Toast from '@/util/Toast.ts'
import { Placeholder } from '@/util/placeholder.ts'
import KeepAlive from 'keepalive-for-react'

// 菜单项, 静态的内容就不写在组件里面了
// 不同类型用户的菜单项不同
const role: UserRole = store.getState().user.loginData.role
const menuItems = role === UserRole.Student ? [
  { index: 1, key: '/index/home', label: '主页', icon: Home },
  // index为0表示分割线
  { index: 0, key: '我的', label: '我的', icon: null },
  { index: 2, key: '/index/card', label: '校园卡管理', icon: CreditCard },
  { index: 3, key: '/index/userinfo', label: '用户信息', icon: AccountBox },
  { index: 4, key: '/index/setting', label: '设置', icon: Settings }
] : role === UserRole.Shop ? [
  { index: 1, key: '/index/home', label: '主页', icon: Home },
  { index: 2, key: '/index/shop', label: '商品管理', icon: LocalShippingOutlined },
  { index: 3, key: '/index/userinfo', label: '用户信息', icon: AccountBox },
  { index: 4, key: '/index/setting', label: '设置', icon: Settings }
] : []

export default function Index() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // 当前登录的用户信息
  const userinfo = useAppSelector<User>(state => state.user.userinfo)

  // 点击header头像弹出菜单的挂载点
  // useRef只有当泛型参数包含null时, 返回的才是不可修改的RefObject. 否则为可修改的MutableRefObject, 类型不一样
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  // 是否打卡header头像下拉菜单
  const [open, setOpen] = useState<boolean>(false)

  // 是否打开左侧导航菜单
  const [openMenu, setOpenMenu] = useState<boolean>(true)
  // 当前选中的菜单项
  const [selectedItem, setSelectedItem] = useState(menuItems[0])
  // onCreated
  useEffect(() => {
    // 刷新(初始渲染)时根据当前路由设置选中的菜单项
    const item = menuItems.find(item => window.location.pathname.includes(item.key))
    if (item) {
      setSelectedItem(item)
    }
    // 初始加载时获取用户信息
    (async () => {
      const res = await apiGetUserInfo()
      if (res.code === 200) {
        dispatch(setUserinfo(res.data))
      } else {
        Toast.error(res.message)
        console.warn('获取用户信息失败', res)
        dispatch(setUserinfo(Placeholder.User()))
      }
    })()
  }, [])

  const selectItem = (index: number, path: string) => {
    const item = menuItems.find(item => item.index === index)
    if (item) {
      setSelectedItem(item)
    }
    navigate(path)
  }

  // 媒体查询, 当屏幕宽度小于1100px时, 左侧菜单栏收起
  const isSmallScreen: boolean = useMediaQuery(useTheme().breakpoints.down(1100))
  useEffect(() => {
    setOpenMenu(!isSmallScreen)
  }, [isSmallScreen])

  // 使用了keep-alive之后, outlet需要切换为hook形式, 不能直接使用<Outlet/>
  const outlet = useOutlet()
  // 用于keep-alive路由缓存的key
  const location = useLocation()
  const cacheKey = useMemo(() => {
    return location.pathname + location.search
  }, [location])

  return (
    <Box className={style.index} sx={{ bgcolor: 'background.default' }}>
      <Grid2 container columns={24}>
        {/* 左侧菜单导航栏
         ClickAwayListener用于实现点击外侧时关闭菜单; Slide为移入的动画组件 */}
        <ClickAwayListener onClickAway={() => isSmallScreen && setOpenMenu(false)}>
          <Slide direction={'right'} in={openMenu} style={{ position: isSmallScreen ? 'absolute' : 'initial' }}>
            <Grid2 size={isSmallScreen ? 12 : 4}>
              <Paper className={style.menuWrapper}>
                <List subheader={<ListSubheader style={{fontSize: '20px', fontWeight: 'bold'}}>校园卡管理系统</ListSubheader>}>
                  {menuItems.map(item => {
                    if (item.index === 0) {
                      return <Divider key={item.index} sx={{ color: '#919191' }} textAlign={'left'}>{item.label}</Divider>
                    } else {
                      return (
                        <ListItemButton
                          divider
                          key={item.key}
                          onClick={_e => selectItem(item.index, item.key)}
                          selected={selectedItem.index === item.index}
                        >
                          <ListItemIcon>{item.icon && <item.icon/>}</ListItemIcon>
                          <ListItemText primary={item.label}/>
                        </ListItemButton>
                      )
                    }
                  })}
                </List>
              </Paper>
            </Grid2>
          </Slide>
        </ClickAwayListener>
        {/* 右侧内容 */}
        <Grid2 size={isSmallScreen ? 24 : 20}>
          {/* 右侧顶部header */}
          <AppBar className={style.header}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                style={{marginRight: '10px', display: isSmallScreen ? 'initial' : 'none'}}
                onClick={(event) => {
                  // 阻止事件冒泡, 防止触发ClickAwayListener的关闭菜单事件, 一打开就关掉了..
                  event.stopPropagation()
                  setOpenMenu(open => !open)
                }}
              >
                <MenuIcon fontSize={'large'}/>
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{selectedItem.label}</Typography>
              <IconButton
                size="large"
                onMouseEnter={() => setOpen(true)}
                ref={anchorRef}
                color="inherit"
              >
                {/* icon的fontsize不能直接写'..px'的字符串, 得用sx属性的fontSize */}
                <AccountCircle fontSize='large'/>
              </IconButton>
              <Menu
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                open={open}
                onClose={() => setOpen(false)}
              >
                <Container><Paper style={{ fontWeight: 'bolder', textAlign: 'center', fontSize: '22px' }}>{userinfo.username}</Paper></Container>
                <MenuItem onClick={() => selectItem(3, '/index/userinfo')}>
                  <ListItemIcon><AccountBox fontSize={'small'}/></ListItemIcon>用户信息
                </MenuItem>
                <MenuItem onClick={() => dispatch(logout())}>
                  <ListItemIcon><Logout fontSize={'small'}/></ListItemIcon>退出登录
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          {/* 右侧下方主体部分 */}
          <Box className={style.mainContent} component={'main'}>
            <KeepAlive activeName={cacheKey} max={10} strategy={'LRU'}>
              {/* 懒加载的路由别忘了加上Suspense */}
              <Suspense>
                {outlet}
              </Suspense>
            </KeepAlive>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  )
}
