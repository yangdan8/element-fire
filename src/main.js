// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getI18n } from '@/frame/utils/i18n'
import App from './App'
import router from './common/router'
import store from './common/store'
import ElementUI from 'element-ui'
import enEle from 'element-ui/lib/locale/lang/en'
import scEle from 'element-ui/lib/locale/lang/zh-CN'
import tcEle from 'element-ui/lib/locale/lang/zh-TW'
import enLocal from '../static/lang/enUs'
import scLocal from '../static/lang/zhCn'
import tcLocal from '../static/lang/zhTw'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import '@/frame/assets/less/index.less'
// import 'material-design-icons/iconfont/material-icons.css'
import '../static/UE/ueditor.config.js'
// import '../static/UE/ueditor.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
import VModal from 'vue-js-modal'
import bus from '@/frame/utils/eventBus'

Vue.use(VModal)

Vue.use(VueI18n)
Vue.use(ElementUI)

Vue.prototype.$echarts = echarts
Vue.prototype.changeLanguage = function(lang) {
  if (lang === null) {
    lang = 'zh-CN'
  }
  Vue.prototype.changeLang = lang
  bus.$emit('lang', lang)
  Vue.config.lang = lang
  localStorage.setItem('lang', lang)
}

var locales = {
  'zh-CN': {
    message: scLocal,
    el: scEle.el
  },
  'en': {
    message: enLocal,
    el: enEle.el
  },
  'zh-TW': {
    message: tcLocal,
    el: tcEle.el
  }
}
// 是否为本地引入语言包
var isLocal = false
if (!isLocal) {
  const i18n = getI18n()
  locales['zh-CN'].message = i18n.data.zhCn
  locales['zh-TW'].message = i18n.data.zhTw
  locales['en'].message = i18n.data.enUs
  Object.keys(locales).forEach(function(lang) {
  Vue.locale(lang, locales[lang])
  })
} else {
    Object.keys(locales).forEach(function(lang) {
        Vue.locale(lang, locales[lang])
    })
}

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
Vue.prototype.$i = function(code) {
  if (code) {
    code = code.toLowerCase()
  }
  return this.$t('message.' + code)
}
window.Event = new Vue()

window.Event.pub = window.Event.$emit

window.Event.sub = window.Event.$on

window.Event.remove = window.Event.$remove

window.document.body.onbeforeunload = function() {
    const curPath = window.vm._route.fullPath
    if (curPath.endsWith('Edit')) {
        const routeName = window.vm._router.currentRoute.name
        var storeNameToUp = routeName.substring(0, 1).toUpperCase() + routeName.substring(1, routeName.length - 4)
        var storeNameToLo = routeName.substring(0, 1).toLowerCase() + routeName.substring(1, routeName.length - 4)
        if (window.vm.$store.state[storeNameToUp]) {
            window.localStorage.setItem('currentPath', routeName)
            window.localStorage.setItem('currentUid', window.vm.$store.state[storeNameToUp].uid)
        } else if (window.vm.$store.state[storeNameToLo]) {
            window.localStorage.setItem('currentPath', routeName)
            window.localStorage.setItem('currentUid', window.vm.$store.state[storeNameToLo].uid)
        }
    }
}

if (window.localStorage.getItem('currentUid')) {
    const routeName = window.localStorage.getItem('currentPath')
    if (routeName) {
        var storeNameToUp = routeName.substring(0, 1).toUpperCase() + routeName.substring(1, routeName.length - 4)
        var storeNameToLo = routeName.substring(0, 1).toLowerCase() + routeName.substring(1, routeName.length - 4)
        if (window.vm.$store.state[storeNameToUp]) {
            window.vm.$store.state[storeNameToUp].uid = window.localStorage.getItem('currentUid')
        } else if (window.vm.$store.state[storeNameToLo]) {
            window.vm.$store.state[storeNameToLo].uid = window.localStorage.getItem('currentUid')
        }
    }
    window.localStorage.setItem('currentUid', undefined)
    window.localStorage.setItem('currentPath', undefined)
}
