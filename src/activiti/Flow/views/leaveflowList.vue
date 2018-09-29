<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <span>{{$i('demo-demo_leaveflow')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <el-input v-model="store.postData.nickName" :placeholder="$i('demo-demo_leaveflow-nickName')" @keyup.native.13="search"></el-input>
                <el-date-picker v-model="store.postData.startLeaveDate" type="date" :placeholder="$i('demo-demo_leaveflow-start_leaveDate')"></el-date-picker>
                <el-date-picker v-model="store.postData.endLeaveDate" type="date" :placeholder="$i('demo-demo_leaveflow-end_leaveDate')"></el-date-picker>
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <el-button type="primary" @click="addData" v-if="permissControl('demo:leaveflow:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" max-height="700" stripe border @selection-change="handleSelectionChange">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <el-table-column header-align="center" prop="nickName" :label="$i('demo-demo_leaveflow-nickName')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="leaveDate" :label="$i('demo-demo_leaveflow-leaveDate')" align="center" show-overflow-tooltip :formatter="elDateFormat"></el-table-column>
            <el-table-column header-align="center" prop="leaveDays" :label="$i('demo-demo_leaveflow-leaveDays')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="reason" :label="$i('demo-demo_leaveflow-reason')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="flowInstanceId" :label="$i('demo-demo_leaveflow-flowInstanceId')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="flowStatus" :label="$i('demo-demo_leaveflow-status')" align="center" show-overflow-tooltip></el-table-column>
            
            <el-table-column header-align="center" align="center" width="160px" :label="$i('cooco_public_table_handle')" v-if="permissControl('demo:leaveflow:mgr')" fixed="right">
                <template slot-scope="scope">
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editData(scope.row.uid)"></i>
                    <i class="el-icon-view" :title="$i('demo-demo_leaveflow-view')" @click="lookData(scope.row.flowInstanceId)"></i>
                    <i class="el-icon-tickets" :title="$i('demo-demo_leaveflow-history')" @click="getHistory(scope.row.flowInstanceId)"></i>
                    <i class="el-icon-share" :title="$i('demo-demo_leaveflow-flow')" @click="flowChart(scope.row.flowInstanceId)"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'demo/demo/leaveflow/list'" :param="store.postData"></pagination>

       <router-view></router-view>
        <el-dialog :title="$i('demo-demo_leaveflow-history')" :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%" :before-close="handleClose">
           <el-table :data="historyData.list" max-height="1024" border >
                <el-table-column fixed="left" type="index" :label="$i('demo-demo_leaveflow-linenum')" width="70"></el-table-column>
                <el-table-column prop="hisProcName" :label="$i('demo-demo_leaveflow-hisProcName')"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="hisProcStartTime" :label="$i('demo-demo_leaveflow-starttime')"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="hisProcEndTime" :label="$i('demo-demo_leaveflow-endtime')"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="hisProcUserName" :label="$i('demo-demo_leaveflow-processman')"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="comment" :label="$i('demo-demo_leaveflow-comment')"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" :label="$i('sys-sys_user-status')"  show-overflow-tooltip></el-table-column>
            </el-table>
            <pagination :result.sync="historyData" :url="'sys/activitiMgr/getHistory'" :param="store"></pagination>
        </el-dialog>
        <router-view></router-view>
        <el-dialog :title="$i('demo-demo_leaveflow-flow')" :visible.sync="chartVisible" :close-on-click-modal="false" width="60%" :before-close="chartClose">
           <img :src="imgData">
        </el-dialog>
    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import { handleDelete, getData } from '@/frame/utils/common'
    import moment from 'moment'
    import { $postQs } from '@/frame/utils/http'

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
                store: this.$store.state.activitiLeaveflow,
                router: this.$router,
                dialogVisible: false,
                chartVisible: false,
                imgData: '',
                historyData: {}
            }
        },
        methods: {
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.store.postData,
                    url: 'demo/demo/leaveflow/list'
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
                this.router.push({ name: 'leaveflowEdit' })
            },
            // 编辑
            editData(uid) {
                this.store.uid = uid
                this.store.keepSearchCondition = true
                this.router.push({ name: 'leaveflowEdit' })
            },
            lookData(uid) {
                $postQs('sys/activitiMgr/getCompeteTaskUserOrRole', {uid: uid}).then((resdata) => {
                    if (resdata.data.code === 0) {
                        this.$message({
                            type: 'info',
                            message: resdata.data.msg
                        })
                    }
                })
            },
            getHistory(uid) {
                this.dialogVisible = true
                const paramG = {
                    data: {uid: uid},
                    url: 'sys/activitiMgr/getHistory'
                }
                const renderData1 = async () => {
                    const res = await getData(paramG)
                    this.historyData = res
                }
                renderData1()
            },
            flowChart(uid) {
                this.chartVisible = true
                $postQs('activiti/model/getHisProgressImg', {processId: uid}).then((resdata) => {
                    if (resdata.data.code === 0) {
                       this.imgData = 'data:image/png;base64,' + resdata.data.data
                    }
                })
            },
            deleteData(uid) {
                const param = {
                    scope: this,
                    url: 'demo/demo/leaveflow/deleteBatch',
                    arr: [],
                    callback: this.getDataList
                }
                if (uid != null) {
                    // 单个删除
                    param.arr.push(uid)
                } else {
                    // 批量删除
                    param.arr = this.deleteUidArray
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
            },
            handleClose() {
                this.dialogVisible = false
            },
            chartClose() {
                this.chartVisible = false
            },
            elDateFormat(row, column, cellValue) {
                const result = cellValue ? this.dateFormat(cellValue) : ''
                return result
            },
            dateFormat(date) {
                return moment(date).format('YYYY-MM-DD')
            }
        },
        mounted() {
            this.clearSearchCondition()
            this.getDataList()
        },
        components: {
            Pagination
        },
        filters: {
            statusFilter(value) {
                return value === 0 ? '否' : '是'
            }
        }
    }
</script>
