# cocoo路由规则 #
#### by q&xl 2017-11-16 ####

***

### 实现原理 ###

cocoo前端使用了vue.js，所以路由使用了由官方支持的 vue-router 库实现。

详细情况可阅读**[vue-router文档](https://router.vuejs.org/zh-cn/ "vue-router文档")**

### 路由基本使用方法 ###

实例化vue对象，并引入router模块

main.js：

```
import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
```

router下的index.js定义了顶级路由的基本情况。

router/index.js：

```
import Vue from 'vue'
import Router from 'vue-router'

import demoRouter from './demo-router'
import sysRouter from './sys-router'
import companyRouter from './company-router'
import activitiRouter from './activiti-router' 
import TestConfigdict from './TestConfigdict-Router'
import codetestRouter from './codetest-router'

Vue.use(Router)

export const asyncRouterMap = [
    {
        path: '/',
        name: 'index',
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
            ...activitiRouter, 
            ...TestConfigdict,
            ...codetestRouter
        ]
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
```

分别对不同的功能模块进行二级路由表划分，引入至顶级路由的children内，即可配置二级路由。二级路由可以根据不同的业务需求进行扩展。

以demoRouter为例

demo-router.js：

```
const demoRouter = [
    {
        path: '/ordermain',
        name: 'orderMain',
        linkname: 'ordermain订单',
        redirect: '/orderMainList',
        component: () => import('@/demo/OrderMain'),
        children: [
            {
                path: '/orderMainList/:isClearCond',
                name: 'orderMainList',
                linkname: 'ordermain订单列表',
                component: () => import('@/demo/OrderMain/views/list')
            },
            {
                path: '/ordermainEdit/:uid',
                name: 'orderMainEdit',
                linkname: 'ordermain订单编辑',
                component: () => import('@/demo/OrderMain/views/edit')
            },
            {
                path: '/ordermainMsEdit/:uid',
                name: 'orderMainMsEdit',
                linkname: 'ordermain订单编辑（多个从表）',
                component: () => import('@/demo/OrderMain/views/MsEdit')
            }
        ]
    },
    ...
]

export default demoRouter
```

demo-router.js定义了二级路由的基本情况。同理，通过二级路由的children可以配置三级路由，也可以进行扩展。


### 文件结构 ###

对应的vue文件结构如下，以company为例：

    Company
      view
        demo
          companyEdit.vue
          companyList.vue
          index.vue

其中，index.vue为入口文件，每个功能模块都应有一个index.vue作为该模块的起始页。

通常情况下，入口文件应为以下内容：

index.vue：

```
<template>
    <section>
        <router-view></router-view>
    </section>
</template>
<script>

export default {
    computed: {
        
    },
    data() {
        return {
        }
    },
    methods: {
        
    },
    mounted() {
    },
    components: {
    },
    filters: {
        
    }
}
</script>

```

如有需要在跳转时保留起始页内容，可以在index.vue中添加需要保留的内容。

以DemoConfigDict的入口文件为例

DemoConfigDict/index.vue：

```
<template>
    <section class="tree-table">
        <div class="tree">
            ...
        </div>
        <router-view></router-view>
        <el-dialog title="通用配置" :visible.sync="dialogDemoConfigVisible" :close-on-click-modal="false">
            ...
        </el-dialog>
    </section>
</template>

<script>
import { DemoConfigDictModel } from '@/model/demo/demoConfigDictModel'
import { getData, toTree, post } from '@/utils/common'

export default {
    mounted() {
        this.getTreeData()
    },
    data() {
        return {
            ...
        }
    },
    methods: {
        ...
    }
}
</script>
<style lang="less">
    ...
</style>

```

页面跳转时，index.vue的内容将会保留显示在固定的区域。

### 面包屑导航 ###

系统顶部带有面包屑导航，导航内容会读取路由表中的name属性，并会以linkname属性显示在界面上。
