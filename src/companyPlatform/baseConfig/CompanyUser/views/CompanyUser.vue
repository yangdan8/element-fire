<template>
  <section class="formList paper">
    <router-view></router-view>
    <span class="title">
            <span>{{$i('sys-sys_user-list')}}</span>
        </span>
    <el-row type="flex" :gutter="20">
      <el-col :span="16">
        <el-input v-model="store.postData.username" :placeholder="$i('sys-sys_user-username')" @keyup.native.13="search"></el-input>
        <el-input v-model="store.postData.nickname" :placeholder="$i('sys-sys_user-nickname')" @keyup.native.13="search"></el-input>
        <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
      </el-col>
      <el-col class="cont-right" :span="4" :offset="4">
        <el-button type="primary" @click="addPage" v-if="permissControl('sys:user:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
        <!-- <el-button type="danger" @click="deleteData()" v-if="permissControl('sys:user:mgr')"><i class="el-icon-delete"></i> 删除</el-button> -->
      </el-col>
    </el-row>
    <el-table :data="result.list" stripe border height="600" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" header-align="center" align="center"></el-table-column>             -->
      <el-table-column header-align="center" align="center" prop="nickname" :label="$i('sys-sys_user-nickname')" fixed="left"></el-table-column>
      <el-table-column header-align="center" align="center" prop="mobile" :label="$i('sys-sys_user-mobile')"></el-table-column>
      <el-table-column header-align="center" align="center" prop="email" :label="$i('sys-sys_user-email')" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column header-align="center" align="center" prop="username" :label="$i('sys-sys_user-username')"></el-table-column>
      <el-table-column header-align="center" align="center" prop="status" :label="$i('sys-sys_user-status')" width="100">
        <template slot-scope="scope">
          <span v-if="!!scope.row.status">{{ scope.row.status | statusFilter }}</span>
          <span v-else style="color:#ff00ff">{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150px" :label="$i('cooco_public_table_handle')" v-if="permissControl('sys:user:mgr')" fixed="right">
        <template slot-scope="scope">
          <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.userId)"></i>
          <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.userId)" v-if="permissControl('sys:user:mgr')"></i>
          <i class="el-icon-date" :title="$i('cooco_public_button_resetpwd')" @click="resetPwd(scope.row.userId)"></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination :result.sync="result" :url="'sys/user/list'" :param="store"></pagination>

  </section>
</template>
<script>
  import Pagination from '@/frame/components/Pagination'
  import formatter from '@/frame/utils/dataFormat'
  import { handleDelete, getData } from '@/frame/utils/common'
  import { $get } from '@/frame/utils/http'

  export default {
    computed: {
      // 多选删除，把选中行的userId存入数组
      getDeleteArr() {
        const arr = []
        this.multipleSelection.forEach((item) => {
          arr.push(item.userId)
      })
        return arr
      }
    },
    data() {
      return {
        fm: formatter,
        result: {},
        store: this.$store.state.companyUser,
        router: this.$router,
        multipleSelection: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteData(singleId) {
        const param = {
          url: 'sys/user/delete',
          arr: this.getDeleteArr,
          id: singleId,
          callback: this.getDataList
        }
        handleDelete(param)
      },
      // 获取列表数据
      getDataList() {
        const param = {
          data: this.store.postData,
          url: 'sys/user/list'
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
      // 新增
      addPage() {
        this.router.push({ name: 'companyUserEdit', params: { type: 'add' } })
      },
      // 编辑
      editPage(id) {
        this.store.userId = id
        this.router.push({ name: 'companyUserEdit' })
      },
      clearSearchCondition() {
        if (!this.store.keepSearchCondition) {
          this.store.postData = {}
        }
      },
      renderList() {
        this.getDataList()
      },
      // 重置密码
      resetPwd(uid) {
        $get('sys/user/resetPwd', { uid: uid })
          .then((res) => {
          if (res.data.code === 0) {
          this.$alert(this.$i('sys-sys_user-successreset'), this.$i('cooco_public_confirm_tip'), {
            confirmButtonText: this.$i('cooco_public_button_confirm')
          })
        }
      })
      }
    },
    mounted() {
      this.clearSearchCondition()
      this.renderList()
    },
    components: {
      Pagination
    },
    filters: {
      statusFilter(value) {
        return value === 0 ? '已禁用' : '启用'
      }
    }
  }
</script>
