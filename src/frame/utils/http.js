import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { applicationContext } from '@/../config/url'

let _applicationContext = ''
if (process.env.NODE_ENV === 'development') {
  _applicationContext = applicationContext !== '/' ? applicationContext + '/' : ''
}
// 创建axios实例
const header = { 'Content-Type': 'application/json;charset=UTF-8' }
const axiosConfig = {
  baseURL: _applicationContext,
  timeout: 10000, // 请求超时时间,
  header: header,
  withCredentials: true
}
const http = axios.create(axiosConfig)

http.interceptors.response.use(response => {
    // const code = response.status
    // console.log(code)
    return response
}, error => {
    // const code = error.status
    var code = 200
    if (error.response) {
        code = error.response.status
    } else if (error.message === 'Network Error') {
        code = 401
    }

    switch (code) {
        case 401:
            Message.info(window.vm.$i('cooco_public_login-unlogin'))
            window.location = './#/login'
            break
        default:
            break
    }
    // TODO
    return Promise.reject(error)
})

function $get(url, obj) {
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

function $post(url, data) {
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

function $postQs(url, obj) {
    const data = qs.stringify(obj)
    return http({
        url: url,
        method: 'post',
        data
    })
}

function $postPr(url, data) {
    return http({
        url: url,
        method: 'post',
        data: data
    })
}

// 用于替换元素直接在属性上发送请求,如<img :src="IMGSERVER + 'sys/captchajpg'">
const $IMGSERVER = _applicationContext
const $FILESERVER = _applicationContext

export { $get, $post, $postQs, $postPr, $IMGSERVER, $FILESERVER }
