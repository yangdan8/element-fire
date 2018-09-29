import { applicationContext } from '@/../config/url'

let _applicationContext = ''
if (process.env.NODE_ENV === 'development') {
  _applicationContext = applicationContext !== '/' ? applicationContext + '/' : ''
}
const getI18n = () => {
    const request = new XMLHttpRequest()
    request.open('GET', _applicationContext + 'sys/i18ncode/getI18nByPlatformType?platformType=admin', false)
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    request.send()
    return JSON.parse(request.response)
}
export {
    getI18n
}
