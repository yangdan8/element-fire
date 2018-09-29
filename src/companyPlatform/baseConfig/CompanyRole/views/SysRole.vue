<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <span>{{$i('sys-sys_role-list')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <el-input v-model="store.postData.roleName" :placeholder="$i('sys-sys_role-role_name')" @keyup.native.13="search"></el-input>
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <el-button type="primary" @click="addPage" v-if="permissControl('sys:role:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" stripe border height="600" @selection-change="handleSelectionChange">
            <!-- <el-table-column fixed="left" type="index" label="行号" width="70"></el-table-column> -->
            <el-table-column prop="roleCode" :label="$i('sys-sys_role-roleCode')"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="roleName" :label="$i('sys-sys_role-role_name')"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" :label="$i('sys-sys_code-explain')" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$i('cooco_public_table_handle')" v-if="permissControl('sys:role:mgr')" fixed="right">
                <template slot-scope="scope">
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editData(scope.row.roleId)"></i>
                    <!-- <el-button class="click-ripple" size="small" type="primary" @click="editData(scope.row.roleId)">编辑</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sys/role/list'" :param="store"></pagination>

    </section>
</template>
<script>
import Pagination from '@/frame/components/Pagination'
import formatter from '@/frame/utils/dataFormat'
import { handleDelete, getData } from '@/frame/utils/common'

export default {
    computed: {
        // 多选删除，把选中行的roleId存入数组
        getDeleteArr() {
            const arr = []
            this.multipleSelection.forEach((item) => {
                arr.push(item.roleId)
            })
            return arr
        }
    },
    data() {
        return {
            fm: formatter,
            result: {},
            store: this.$store.state.SysRole,
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
                url: 'sys/role/deleteBatch',
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
                url: 'sys/role/list'
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
            this.store.uid = ''
            this.store.keepSearchCondition = false
            this.router.push({ name: 'companyRoleEdit', params: { type: 'add' } })
        },
        // 编辑
        editData(uid) {
            this.store.uid = uid
            this.store.keepSearchCondition = true
            this.router.push({ name: 'companyRoleEdit' })
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
