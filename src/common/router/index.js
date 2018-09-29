import Vue from 'vue'
import Router from 'vue-router'
import demoRouter from './demo-router'
import sysRouter from './sys-router'
import companyRouter from './company-router'
import activitiRouter from './activiti-router'

Vue.use(Router)
export const asyncRouterMap = [
    {
        path: '/index',
        linkname: '首页',
        component: () => import('@/frame/Layout'),
        children: [
            {
                path: '/',
                name: 'dashboard',
                linkname: '图表示例',
                component: () => import('@/dashBoard')
            },
            ...demoRouter,
            ...sysRouter,
            ...companyRouter,
            ...activitiRouter
        ]
    },
    {
        path: '/',
        name: '欢迎页',
        component: () => import('@/frame/Layout/Welcome')
    },
    {
        path: '/login',
        name: '登录页',
        component: () => import('@/frame/Login')
    }

]

export default new Router({
    routes: asyncRouterMap
})
