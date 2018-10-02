import axios from 'axios'
import Qs from 'qs'
import store from '../store'
import config from '@/config'
const BASEURL = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const _baseConfig = {
  baseURL: BASEURL,
  headers: {},
  params: {},
  paramsSerializer: function (params) {
    return Qs.stringify(params)
  },
  validateStatus: status => {
    // 处理响应状态码
    switch (status) {
      case 401:
        location.hash = '#/login'
        return false
      case 500:
        // console.log(500);
        return false
    }
    return status >= 200 && status < 300 // 默认的, 为false时进入'响应拦截器'catch
  },
  transformResponse: [
    function (data) {
      // 对 data 进行任意转换处理
      // console.log(data);
      return data
    }
  ],
  timeout: 3 * 60 * 1000,
  responseType: 'json'
}

const _http = axios.create(_baseConfig)

// 请求拦截器
_http.interceptors.request.use(
  function (config) {
    config.setLoading && store.commit('setIsLoading', true)
    // 可以在这里修改请求头
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
let timer = null
let timer2 = null
_http.interceptors.response.use(
  function (response) {
    // 在这里统一处理自定义状态码(如果有)
    // console.log(response.headers.pragma);
    store.commit('setIsLoading', false)
    return response.data
  },
  function (error) {
    const errMsg = error.response.data
    const status = error.response.status
    if (status === 401) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        Message.error({
          content: errMsg,
          duration: 10,
          closable: true
        })
      }, 500)
    } else if (errMsg) {
      Message.error({
        content: errMsg,
        duration: 10,
        closable: true
      })
    } else {
      clearTimeout(timer2)
      timer2 = setTimeout(() => {
        Message.error({
          content: '未知错误',
          duration: 10,
          closable: true
        })
      }, 500)
    }
    if (!navigator.onLine) {
      console.log('无法连接网络')
    }
    store.commit('setIsLoading', false)
    return Promise.reject(error)
  }
)

const _HttpService = {
  post: (url, data, config) => {
    const _selfConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      setLoading: true
    }
    config = Object.assign({}, _selfConfig, config)
    return _http.post(url, data, config)
  },
  postObj: (url, data, config) => {
    const _selfConfig = {
      headers: {
        'Content-Type': 'application/json'
      },
      setLoading: true
    }
    config = Object.assign({}, _selfConfig, config)
    return _http.post(url, JSON.stringify(data), config)
  },
  postParams: (url, data, config) => {
    const _selfConfig = {
      params: data,
      setLoading: true
    }
    config = Object.assign({}, _selfConfig, config)
    return _http.post(url, null, config)
  },
  get: (url, data, config) => {
    const _selfConfig = {
      params: data,
      setLoading: true
    }
    config = Object.assign({}, _selfConfig, config)
    return _http.get(url, config)
  }
}

export const $http = _HttpService
export const $FILESERVER = BASEURL
