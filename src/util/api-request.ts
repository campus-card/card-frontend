import axios, { AxiosInstance } from 'axios'
import store from '@/redux'

export const baseURL: string = 'http://localhost:8192/campusCard'

const apiRequest: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截器
apiRequest.interceptors.request.use(config => {
  config.headers.Authorization = store.getState().user.loginData.token
  console.log('@@请求地址: ', config.url, '; 请求信息: ', config)
  return config
}, error => {
  return error
})

// 响应拦截器
apiRequest.interceptors.response.use(response => {
  return response
}, error => {
  console.warn('请求失败, url: ', error.config?.url, '; 详细信息: ', error)
  return Promise.reject(error)
})

export default apiRequest
