<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
          <!--流程部署-->
            <span>{{$i('act-act_re_procdef-process_deploy')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
              <!--流程名称-->
                <el-input v-model="store.postData.processName" :placeholder="$i('act-act_re_procdef-process_name')" @keyup.native.13="search"></el-input>
              <!--搜索-->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i> {{$i('cooco_public_button_search')}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" max-height="700" stripe border @selection-change="handleSelectionChange">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
          <!--流程ID-->
            <el-table-column header-align="center" prop="processId" :label="$i('act-act_re_procdef-process_id')" align="center" show-overflow-tooltip></el-table-column>
          <!--部署ID-->
            <el-table-column header-align="center" prop="deployId" :label="$i('act-act_re_procdef-deploy_id')" align="center" show-overflow-tooltip></el-table-column>
          <!--流程名称-->
            <el-table-column header-align="center" prop="processName" :label="$i('act-act_re_procdef-process_name')" align="center" show-overflow-tooltip></el-table-column>
          <!--流程KEY-->
            <el-table-column header-align="center" prop="processKey" :label="$i('act-act_re_procdef-process_key')" align="center" show-overflow-tooltip></el-table-column>
          <!--流程描述-->
            <el-table-column header-align="center" prop="processDes" :label="$i('act-act_re_procdef-process_desc')" align="center" show-overflow-tooltip></el-table-column>
          <!--版本号-->
            <el-table-column header-align="center" prop="processVer" :label="$i('act-act_re_procdef-version')" align="center" show-overflow-tooltip></el-table-column>
          <!--流程状态-->
            <el-table-column header-align="center" prop="processStatus" :label="$i('act-act_re_procdef-process_status')" align="center" show-overflow-tooltip></el-table-column>
          <!--流程状态-->
            <el-table-column header-align="center" align="center" prop="processStatus" :label="$i('act-act_re_procdef-process_status')"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.processStatus == 2" style="color:#fb7906">{{$i('act-act_re_procdef-hanging')}}</span>
                    <span v-else >{{$i('act-act_re_procdef-activation')}}</span>
                </template>
            </el-table-column>
          <!--操作-->
            <el-table-column header-align="center" :label="$i('cooco_public_table_handle')" fixed="right" width="120px" >
                <template slot-scope="scope">
                  <!--挂起-->
                    <i class="el-icon-error" :title="$i('act-act_re_procdef-hanging')" v-if="scope.row.processStatus==1" @click="reactData(scope.row.processId)"></i>
                  <!--激活-->
                    <i class="el-icon-success" :title="$i('act-act_re_procdef-activation')" v-if="scope.row.processStatus==2" @click="reactData(scope.row.processId)"></i>
                  <!--删除-->
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.processId)"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'activiti/model/getAllProcess'" :param="store"></pagination>

    </section>
</template>
<script>
import Pagination from '@/frame/components/Pagination'
import { handleDelete, handleData, getData } from '@/frame/utils/common'

export default {
    computed: {
        // 多选删除，把选中行的uid存入数组
        deleteUidArray() {
            const arr = []
            this.multipleSelection.forEach((item) => {
                arr.push(item.uid)
            })
            return arr
        }
    },
    data() {
        return {
            // 表格数据
            result: {},
            multipleSelection: [],
            store: this.$store.state.activitiProcess,
            router: this.$router
        }
    },
    methods: {
        // 获取列表数据
        getDataList() {
            const param = {
                data: this.store.postData,
                url: 'activiti/model/getAllProcess'
            }
            const renderData = async () => {
                const data = await getData(param)
                this.result = data
            }
            renderData()
        },
        // 权限控制
        permissControl(string) {
            return this.$store.state.permissions.indexOf(string) !== -1
        },
        // 新增
        addData() {
            // 如果传null，vue-router会报错
            this.store.uid = ''
            this.store.keepSearchCondition = false
            this.router.push({ name: 'processEdit' })
        },
        // 编辑
        reactData(uid) {
            const param = {
                scope: this,
                url: 'activiti/model/changeProcessStatus',
                arr: {},
                callback: this.getDataList
            }
            param.arr = {'processId': uid}
            handleData(param)
        },
        deleteData(uid) {
            const param = {
                url: 'activiti/model/deleteProcess',
                arr: this.deleteUidArray,
                id: uid,
                callback: this.getDataList
            }
            handleDelete(param)
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 搜索
        search() {
            delete this.store.postData.page
            this.getDataList()
        },
        clearSearchCondition() {
            if (!this.store.keepSearchCondition) {
                this.store.postData = {}
            }
        }

    },
    mounted() {
        this.clearSearchCondition()
        this.getDataList()
    },
    components: {
        Pagination
    }
}
</script>
