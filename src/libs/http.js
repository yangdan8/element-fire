import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const header = { 'Content-Type': 'application/json;charset=UTF-8' }

const http = axios.create({
  timeout: 5000, // 请求超时时间,
  header: header,
  withCredentials: true
})

http.interceptors.response.use(
  response => {
    // const code = response.status
    // console.log(code)
    return response
  },
  error => {
    // const code = error.status
    const code = error.response.status
    switch (code) {
      case 401:
        this.$Message.info('您未登录或长时间未操作，会话过期，需重新登录 !')
        window.location = './#/login'
        break
      default:
        break
    }
    // TODO
    return Promise.reject(error)
  }
)

function $get (url, obj) {
  if (obj) {
    const data = qs.stringify(obj)
    return http({
      url: url + '?' + data,
      method: 'get'
    })
  } else {
    return http({
      url: url,
      method: 'get'
    })
  }
}

function $post (url, data) {
  if (data) {
    return http({
      url: url,
      method: 'post',
      data
    })
  } else {
    return http({
      url: url,
      method: 'post'
    })
  }
}

function $postQs (url, obj) {
  const data = qs.stringify(obj)
  return http({
    url: url,
    method: 'post',
    data
  })
}

function $postPr (url, data) {
  return http({
    url: url,
    method: 'post',
    data: data
  })
}

export { $get, $post, $postQs, $postPr }
