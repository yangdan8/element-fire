<template>
  <section class="formList paper">
    <router-view></router-view>
    <span class="title">
            <!-- 系统日志列表 -->
            <span>{{$i('sysbase-sys_log')}}</span>
        </span>
    <el-row type="flex" :gutter="20">
      <el-col :span="16">
        <!-- 用户名 -->
        <el-input v-model="store.postData.username" :placeholder="$i('sysbase-sys_log-username')"
                  @keyup.native.13="search"></el-input>
        <!-- 搜索按钮 -->
        <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="result.list" stripe border height="600" @selection-change="handleSelectionChange">
      <!--<el-table-column fixed="left" type="index" label="行号" width="70"></el-table-column>-->
      <!-- 用户名 -->
      <el-table-column header-align="center" prop="username" :label="$i('sysbase-sys_log-username')"
                       show-overflow-tooltip></el-table-column>
      <!-- 用户操作 -->
      <el-table-column header-align="center" prop="operation" :label="$i('sysbase-sys_log-operation')"
                       show-overflow-tooltip></el-table-column>
      <!-- 请求方法 -->
      <el-table-column header-align="center" prop="method" :label="$i('sysbase-sys_log-method')"
                       show-overflow-tooltip></el-table-column>
      <!-- IP地址 -->
      <el-table-column header-align="center" prop="ip" :label="$i('sysbase-sys_log-ip')"
                       show-overflow-tooltip></el-table-column>
      <!-- 创建时间 -->
      <el-table-column header-align="center" :formatter="fm.datetime" align="center" prop="createDate"
                       :label="$i('sysbase-sys_log-create_date')" show-overflow-tooltip></el-table-column>
    </el-table>

    <pagination :result.sync="result" :url="'sys/log/list'" :param="store"></pagination>

  </section>
</template>
<script>
  import Pagination from '@/frame/components/Pagination'
  import formatter from '@/frame/utils/dataFormat'
  import {getData} from '@/frame/utils/common'

  export default {
    data() {
      return {
        fm: formatter,
        result: {},
        store: this.$store.state.SysLog,
        router: this.$router,
        multipleSelection: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 获取列表数据
      getDataList() {
        const param = {
          data: this.store.postData,
          url: 'sys/log/list'
        }
        const renderData = async () => {
          const data = await getData(param)
          this.result = data
        }
        renderData()
      },
      // 搜索
      search() {
        delete this.store.postData.page
        this.getDataList()
      },
      // 权限控制
      permissControl(str) {
        return this.$store.state.permissions.indexOf(str) !== -1
      },
      clearSearchCondition() {
        if (!this.store.keepSearchCondition) {
          this.store.postData = {}
        }
      },
      renderList() {
        this.getDataList()
      }

    },
    mounted() {
      this.clearSearchCondition()
      this.renderList()
    },
    components: {
      Pagination
    }
  }
</script>
<style lang="less">
  .formList {
    justify-content: flex-start;
    width: 100%;
  }
</style>
