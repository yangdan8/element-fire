<template>
  <el-breadcrumb class="app-levelbar" separator=">">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
      <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
      <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: [],
      routerList: this.$router.options.routes[0].children
    }
  },
  methods: {
    getBreadcrumb() {
      const matched = this.$route.matched.filter((item) => {
          return item.name
      })
      matched[0].path = '/'
      matched[0].name = '首页'
      this.levelList = matched
      this.translateRouterName()
    },
    /**
     * [translateRouterName：路由名称转换]
     * by q&xl at 2017-11-10
     */
    translateRouterName() {
      // 遍历获取到的面包屑路径对象
      for (let i = 0; i < this.levelList.length; i++) {
        // 遍历路由表，寻找与面包屑路径对应的部分
        for (const key in this.routerList) {
          // 发现匹配项，开始做转换处理
          if (this.routerList[key].name === this.levelList[i].name) {
            this.levelList[i].name = this.routerList[key].linkname
            // 转换完成后，进行下一级路由的遍历
            Object.assign(this.routerList, this.routerList[key].children)
            break
          }
        }
      }
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style lang="less" scoped>
.app-levelbar {
    display: none;
}

@media screen and (min-width: 767px) {
    .app-levelbar {
        display: block;
        .el-breadcrumb {
            display: inline-block;
            font-size: 14px;
            line-height: 50px;
            margin-left: 10px;
            > span:last-child {
                min-width: 120px;
                text-align: left;
            }
            .no-redirect {
                color: #97a8be;
                cursor: text;
            }
        }
    }
}
</style>
