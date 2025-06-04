import { Page } from '@/api/common.ts'
import { Category, Image } from '@/type/Image.ts'
import apiRequest from '@/util/api-request.ts'
import { DataResponse } from '@/type/Api.ts'
import { spliceWithPlaceholder } from '@/util/common.ts'
import Toast from '@/util/Toast.ts'

export const apiSearchImages = async (page: number, pageSize: number, dataList: Image[], force: boolean = false, categoryIds: number[], title: string | null, isAsc: number = 0, order: number = 1): Promise<Page<Image>> => {
  if (!force) {
    const targetPage = dataList.slice((page - 1) * pageSize, page * pageSize)
    if (targetPage.filter(item => item).length === pageSize) {
      return { data: targetPage } as Page<Image>
    }
  }
  // axios GET请求参数中直接传递数组的话会转换成categoryIds[]=1&categoryIds[]=2的形式, 后端不好处理, 所以这里直接手动构造查询参数对象
  const params = new URLSearchParams()
  params.append('page', String(page))
  params.append('pageSize', String(pageSize))
  params.append('isAsc', String(isAsc))
  params.append('order', String(order))
  if (categoryIds.length > 0) {
    categoryIds.forEach(id => {
      params.append('categoryIds', String(id))
    })
  } else {
    params.append('categoryIds', '')
  }

  if (title) {
    params.append('title', title)
  }
  const { data } = await apiRequest.get('/imagePost/search', {
    params
  })
  const res = data as DataResponse<Page<Image>>
  if (res.code === 200) {
    spliceWithPlaceholder(dataList, (page - 1) * pageSize, pageSize, ...res.data.data)
    return res.data
  } else {
    console.warn('获取商品列表失败', res)
    Toast.error(res.message)
    return { data: [] } as unknown as Page<Image>
  }
}

export const apiPublishImage = async (title: string, description: string, categoryIds: number[], image: File): Promise<DataResponse> => {
  const { data } = await apiRequest.postForm('/imagePost/upload', {
    title,
    description,
    categoryIds,
    image
  })
  return data
}

export const apiDeleteImage = async (id: number): Promise<DataResponse> => {
  const { data } = await apiRequest.delete('/imagePost/deleteImage', {
    params: {
      id
    }
  })
  return data as DataResponse
}

export const apiGetAllCategories = async (): Promise<Category[]> => {
  const { data } = await apiRequest.get('/imagePost/getAllCategories')
  const res = data as DataResponse<Category[]>
  if (res.code === 200) {
    return res.data as Category[]
  } else {
    console.warn('获取所有图片类别失败', res)
    Toast.error(res.message)
    return []
  }
}

export const apiDownloadImage = async (imageId: number) => {
  const { data } = await apiRequest.get(`/imagePost/download/${imageId}`, {
    responseType: 'blob'
  })
  // 创建临时下载链接
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  // 设置下载文件名
  link.setAttribute('download', `image-${imageId}.jpg`)
  document.body.appendChild(link)
  link.click()

  // 清理临时链接
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const apiGetImageById = async (imageId: number): Promise<Image> => {
  const { data } = await apiRequest.get(`/imagePost/${imageId}`)
  const res = data as DataResponse<Image>
  if (res.code === 200) {
    return res.data
  } else {
    console.warn('获取图片详情失败', res)
    Toast.error(res.message)
    return {} as Image
  }
}
