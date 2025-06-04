import style from './index.module.scss'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Fab,
  IconButton,
  ImageList, ImageListItem,
  InputAdornment, InputLabel,
  MenuItem,
  OutlinedInput, Pagination,
  Paper,
  Select, SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import EmptyCover from '@/assets/svg/empty-image.svg'
import { useAppSelector } from '@/redux/typing.ts'
import type { Image, Category } from '@/type/Image.ts'
import {
  apiDeleteImage,
  apiDownloadImage,
  apiGetAllCategories,
  apiGetImageById,
  apiPublishImage,
  apiSearchImages
} from '@/api/image.ts'
import Toast from '@/util/Toast.ts'
import { User } from '@/type/User.ts'
import { Add, AddPhotoAlternate, Delete, Panorama, Warning } from '@mui/icons-material'

export default function ImageSearchPage() {

  // 搜索关键字
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
  // 当前登录的用户信息
  const userInfo = useAppSelector<User>(state => state.user.userInfo)

  // 所有的图片类别
  const [allCategories, setAllCategories] = useState<Category[]>([])
  // 分页查询相关数据
  const imageListData = useRef<Image[]>([])
  const [imageList, setImageList] = useState<Image[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const totalNum = useRef<number>(0)
  const pageSize = 9

  // 初始化图片列表第一页的数据, 以及获取所有类别
  useEffect(() => {
    initImageListData()
    apiGetAllCategories()
      .then(res => {
        setAllCategories([{id: 0, name: '全部', selected: true}, ...res])
      })
  }, [])

  const initImageListData = () => {
    setCurrentPage(1)
    imageListData.current = []
    apiSearchImages(1, pageSize, imageListData.current, true, [], null)
      .then(res => {
        setImageList(res.data)
        setTotalPage(res.pages)
        totalNum.current = res.total
      })
  }

  const changePage = (_e: ChangeEvent<unknown>, page: number) => {
    (async () => {
      setCurrentPage(page)
      let selectedCategoryIds: number[] = allCategories.filter(cat => cat.selected).map(cat => cat.id)
      // 如果选择的是'全部'类别, 则不进行类别筛选
      if (selectedCategoryIds[0] === 0) {
        selectedCategoryIds = []
      }
      const pageData = await apiSearchImages(page, pageSize, imageListData.current, true, selectedCategoryIds, searchTerm)
      setImageList(pageData.data)
    })()
  }

  const handleImageClick = (image: Image) => {
    apiGetImageById(image.id).then()
    // 增加浏览量
    if (image.userId !== userInfo.id) {
      setSelectedImage({...image, browse: image.browse + 1})
        // 更新浏览量
      setImageList(prevList => prevList.map(img => img.id === image.id ? {...img, browse: img.browse + 1} : img))
    } else {
      setSelectedImage(image)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
  }

  const handleDownload = () => {
    if (selectedImage) {
      apiDownloadImage(selectedImage.id).then()
    }
  }

  const handleSearch = () => {
    // 搜索关键词为空时表示不对搜索名称进行筛选
    setCurrentPage(1)
    imageListData.current = []
    let selectedCategoryIds: number[] = allCategories.filter(cat => cat.selected).map(cat => cat.id)
    // 如果选择的是'全部'类别, 则不进行类别筛选
    if (selectedCategoryIds[0] === 0) {
      selectedCategoryIds = []
    }
    apiSearchImages(1, pageSize, imageListData.current, true, selectedCategoryIds, searchTerm)
      .then(res => {
        if (res.data.length === 0) {
          Toast.info('没有找到匹配的图片')
        }
        setImageList(res.data)
        setTotalPage(res.pages)
        totalNum.current = res.total
      })
  }

  const handleSelectCategory = (category: Category) => {
    if (category.name === '全部') {
      setAllCategories(prevCategories => {
        return prevCategories.map(cat => {
          if (cat.name === '全部') {
            return {...cat, selected: true}
          }
          return {...cat, selected: false}
        })
      })
      return
    }
    setAllCategories(prevCategories => {
      return prevCategories.map(cat => {
        if (cat.name === '全部') {
          return {...cat, selected: false}
        }
        if (cat.id === category.id) {
          return {...cat, selected: !cat.selected}
        }
        return cat
      })
    })
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setAllCategories(prevCategories => {
      return prevCategories.map(cat => {
        if (cat.name === '全部') {
          return {...cat, selected: true}
        }
        return {...cat, selected: false}
      })
    })
  }

  // 发布图片的modal
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  // 删除图片
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const deleteId = useRef<number>(0)
  const deleteImage = async (id: number) => {
    console.log('删除图片ID:', id)
    const res = await apiDeleteImage(id)
    if (res.code === 200) {
      Toast.warning('已删除图片')
      setIsDialogOpen(false)
      // 将数据列表中的对应数据删除. 列表中可能有undefined, 所以还要判断是否为undefined
      imageListData.current = imageListData.current.filter(item => item === undefined || item.id !== id)
      totalNum.current -= 1
      // 重新获取当前页的数据
      let selectedCategoryIds: number[] = allCategories.filter(cat => cat.selected).map(cat => cat.id)
      // 如果选择的是'全部'类别, 则不进行类别筛选
      if (selectedCategoryIds[0] === 0) {
        selectedCategoryIds = []
      }
      const pageData = await apiSearchImages(currentPage, pageSize, imageListData.current, true, selectedCategoryIds, searchTerm)
      setImageList(pageData.data)
      // 重新计算总页数
      if (totalNum.current % pageSize === 0) {
        setTotalPage(p => p - 1)
      }
      setOpenDeleteModal(false)
    } else {
      Toast.error(res.message)
      console.warn('删除失败', res)
    }
  }

  return (
    <Container disableGutters className={style.imageShare}>
      {/* 页面标题 */}
      <Paper className={style.header}>
        <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700}}>
          探索精彩图片世界
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{maxWidth: 800, mx: 'auto'}}>
          搜索并发现来自不同用户的精美图片, 涵盖自然、城市、建筑等多种类别
        </Typography>
      </Paper>
      {/* 搜索栏 */}
      <Paper className={style.searchSection}>
        <Box className={style.searchBar}>
          <TextField
            className={style.searchInput}
            variant="outlined"
            placeholder="搜索图片..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon/>
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch}>
                      <ClearIcon/>
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon/>}
            onClick={handleSearch}
          >
            搜索
          </Button>
        </Box>
        {/* 分类筛选的小卡片 */}
        <Box className={style.filterChips}>
          {allCategories.map(category => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => handleSelectCategory(category)}
              variant={category.selected ? 'filled' : 'outlined'}
              color="primary"
            />
          ))}
        </Box>
      </Paper>
      {/* 图片列表区域 */}
      <Paper className={style.content}>
        {imageList.length > 0 ? (
          <Box className={style.gallery}>
            {imageList.map(image => (
              <Card
                key={image.id} raised
                className={style.card}
                sx={{bgcolor: 'background.paper'}}
              >
                <CardActionArea onClick={() => handleImageClick(image)}>
                  <CardMedia
                    image={image.imageUrl || EmptyCover}
                    title={image.title}
                    className={style.media}
                  />
                  <CardContent className={style.cardContent}>
                    <Typography variant="h6" className={style.title}>
                      {image.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={style.description}>
                      {image.description}
                    </Typography>

                    <Box className={style.categories}>
                      {image.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Box
                      className={style.stats}
                      sx={{borderColor: 'divider'}}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <VisibilityIcon fontSize="small" sx={{mr: 0.5}}/>
                        {image.browse.toLocaleString()} 次浏览
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <FavoriteIcon fontSize="small" sx={{mr: 0.5, color: 'error.main'}}/>
                        {image.likes.toLocaleString()} 个赞
                      </Typography>
                    </Box>
                  </CardActions>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            className={style.noResults}
            sx={{bgcolor: 'background.paper', borderRadius: 2}}
          >
            <Typography variant="h5" gutterBottom color="text.secondary">
              没有找到匹配的图片
            </Typography>
            <Typography variant="body1" color="text.secondary">
              请尝试其他搜索关键词或类别
            </Typography>
          </Box>
        )}
      </Paper>
      <Paper className={style.pagination}>
        <Pagination onChange={changePage} page={currentPage} count={totalPage} color="primary"/>
      </Paper>
      {/* 右下角发布图片的悬浮按钮 */}
      <Fab size="large" color="primary" sx={{ position: 'absolute', bottom: 128, right: 96 }} onClick={() => setOpenAddModal(true)}><Add/></Fab>
      {/* 查看图片详细信息的Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selectedImage && (
          <>
            <DialogTitle>{selectedImage.title}</DialogTitle>
            <DialogContent className={style.dialogContent}>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 16 }}
              />

              <Typography variant="h4" className={style.dialogTitle}>
                {selectedImage.title}
              </Typography>
              <Typography
                variant="body1"
                className={style.dialogDescription}
                color="text.secondary"
              >
                {selectedImage.description}
              </Typography>

              <Box
                className={style.dialogStats}
                sx={{borderColor: 'divider'}}
              >
                <Typography variant="body1" color="text.secondary">
                  <VisibilityIcon fontSize="medium" sx={{mr: 1}}/>
                  {selectedImage.browse.toLocaleString()} 次浏览
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <FavoriteIcon fontSize="medium" sx={{mr: 1, color: 'error.main'}}/>
                  {selectedImage.likes.toLocaleString()} 个赞
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, m: '5px 0' }}>
                {selectedImage.categories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category.name}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon/>}
                onClick={handleDownload}
              >
                下载图片
              </Button>
              {userInfo.id === selectedImage.userId && (
                <Button variant={'outlined'} color={'error'} onClick={() => {
                  deleteId.current = selectedImage.id
                  setOpenDeleteModal(true)
                }}>删除图片</Button>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                关闭
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {/* 发布图片的Dialog */}
      <PostImage open={openAddModal} setOpen={setOpenAddModal} refreshList={initImageListData} categories={allCategories.slice(1)}/>
      {/* 删除图片的确认Modal */}
      <Dialog sx={{ zIndex: 2147483647 }} keepMounted open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle><Warning fontSize={'inherit'}/> 删除商品</DialogTitle>
        <DialogContent>
          <DialogContentText>是否确实要删除该商品?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} autoFocus>取消</Button>
          <Button onClick={() => deleteImage(deleteId.current)} color={'error'}
                  variant={'contained'}>确认删除</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
};

/**
 * 发布图片的modal
 */
const PostImage = ({open, setOpen, refreshList, categories}: {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  refreshList: Function,
  categories: Category[]
}) => {
  // 预览图片的url
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const coverInputRef = useRef<HTMLInputElement>(null)
  const preview = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file?.size) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }
  const deletePreview = () => {
    // 创建过的URL需要手动释放资源
    URL.revokeObjectURL(previewUrl)
    // 清空value属性也能清空input中的文件
    coverInputRef.current?.value && (coverInputRef.current.value = '')
    setPreviewUrl('')
  }

  // 选中的图片类别
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const handleSelect = (event: SelectChangeEvent<number[]>) => {
    const { target: { value } } = event
    setCategoryIds(typeof value === 'string' ? value.split(',').map(Number) : value)
    console.log('value = ', value)
  }

  // 重置表单的按钮的ref
  const resetRef = useRef<HTMLButtonElement>(null)

  const publishImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = Object.fromEntries(formData.entries())
    console.log('发布图片数据:', data)
    if (!data.title || !data.description) {
      Toast.error('标题或描述不能为空')
      return
    }
    if (categoryIds.length === 0) {
      Toast.error('请选择至少一个类别')
      return
    }
    if (!data.image.size) {
      Toast.error('请上传图片')
      return
    }
    const res = await apiPublishImage(data.title, data.description, categoryIds, data.image)
    if (res.code === 200) {
      Toast.success('图片发布成功')
      refreshList() // 刷新图片列表
      deletePreview()
      resetRef.current?.click() // 重置表单
      setOpen(false)
    } else {
      Toast.error('发布图片失败')
      console.error('发布图片失败', res)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      keepMounted
      slotProps={{
        paper: { component: 'form', onSubmit: publishImage }
      }}
    >
      <DialogTitle><Panorama fontSize={'inherit'}/>发布图片</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>图片的描述信息</DialogContentText>
        <Button
          component={'label'}
          variant={'contained'}
          tabIndex={-1}
          startIcon={<AddPhotoAlternate/>}
        >
          上传图片
          <input ref={coverInputRef} type="file" name="image" onChange={preview} hidden/>
        </Button>
        {previewUrl && (
          <Tooltip title="删除图片" arrow placement="right">
            <IconButton onClick={deletePreview} size="large">
              <Delete/>
            </IconButton>
          </Tooltip>
        )}
        {previewUrl && (
          <ImageList>
            <ImageListItem>
              <img src={previewUrl} alt="封面预览" style={{width: '100%', height: '100%'}}/>
            </ImageListItem>
          </ImageList>
        )}
        <TextField fullWidth name="title" label="标题" variant="standard"/>
        <TextField fullWidth name="description" label="描述" variant="standard"/>
        <InputLabel id="select-categories">选择类别</InputLabel>
        <Select
          labelId="select-categories"
          name="categoryIds"
          multiple
          value={categoryIds}
          onChange={handleSelect}
          input={<OutlinedInput label="选择类别" />}
          sx={{ width: 250 }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
              },
            },
          }}
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button variant={'text'} type={'reset'} ref={resetRef} onClick={() => setCategoryIds([])}>重置</Button>
        <Button variant={'contained'} color={'secondary'} onClick={() => {
          setOpen(false)
          resetRef.current?.click()
        }}>取消</Button>
        <Button variant={'contained'} type="submit">发布图片</Button>
      </DialogActions>
    </Dialog>
  )
}
