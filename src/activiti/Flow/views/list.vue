<template>
    <section class="formList">

        <p class="batch-handle">

            <el-input v-model="condition.nickName" placeholder="请假人" @keyup.native.13="conditionSearch"></el-input>
            <el-date-picker v-model="condition.startLeaveDate" type="date" placeholder="开始请假日期"></el-date-picker>
            <el-date-picker v-model="condition.endLeaveDate" type="date" placeholder="结束请假日期"></el-date-picker>

            <el-button class="click-ripple" type="primary" @click="conditionSearch"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button class="click-ripple" type="primary" @click="addData" v-if="permissControl('demo:leaveflow:mgr')"><i class="el-icon-edit"></i> 新增</el-button>
            <el-button class="click-ripple" type="danger" @click="deleteData(null)" v-if="permissControl('demo:leaveflow:mgr')"><i class="el-icon-delete"></i> 删除</el-button>
        </p>

        <el-table :data="tableData" max-height="700" border @selection-change="handleSelectionChange">
            <el-table-column fixed="left" type="index" label="行号" width="70"></el-table-column>
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column prop="companyId" label=""  show-overflow-tooltip></el-table-column>
            <el-table-column prop="userId" label="请假人id"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="nickName" label="请假人"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="leaveDate" label="请假日期"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="leaveDays" label="请假天数"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="reason" label="请假原因"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowInstanceId" label="流程实例ID"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowStatus" label="" fixed="right"  show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" v-if="permissControl('demo:leaveflow:mgr')" fixed="right">
                <template slot-scope="scope">
                    <el-button class="click-ripple" size="small" @click="editData(scope.row.uid)">编辑</el-button>
                    <el-button class="click-ripple" size="small" type="danger" @click="deleteData(scope.row.uid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pageData="resData" @pageChange="changePage"></pagination>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import { ConditionModel } from '@/activiti/Flow/model/demoLeaveflowModel'
    import moment from 'moment'
    import { handleDelete, getData } from '@/frame/utils/common'

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
                // 权限点控制
                permissionArr: [],
                // 表格数据
                tableData: [],
                multipleSelection: [],
                // 后台响应数据
                resData: {
                    currPage: 0,    // 当前页面
                    pageSize: 0,   // 每页条数
                    totalCount: 0,
                    totalPage: 0,
                    list: []
                },
                // 查询条件
                condition: new ConditionModel()
            }
        },
        methods: {
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.$store.state.demoLeaveflow.reqData,
                    url: 'demo/demo/leaveflow/list'
                }
                const renderData = async () => {
                    const data = await getData(param)
                    this.tableData = data.list
                    Object.assign(this.resData, data)
                }
                renderData()
            },
            // 权限控制
            permissControl(string) {
                return this.permissionArr.indexOf(string) !== -1
            },
            // 翻页
            changePage(data) {
                var store = this.$store
                // 将当前页等数据存入store以便记忆
                store.commit('DEMOLEAVEFLOW_LIST_REQ_DATA', data)
                this.getDataList()
            },
            // 条件查询
            conditionSearch() {
                var condition = this.condition
                var store = this.$store
                const data = {
                    nickName: this.condition.nickName,
                    startLeaveDate: this.condition.startLeaveDate ? this.dateFormat(this.condition.startLeaveDate) : '',
                    endLeaveDate: this.condition.endLeaveDate ? this.dateFormat(this.condition.endLeaveDate) : '',
                    page: 1
                }
                store.commit('DEMOLEAVEFLOW_LIST_CONDITION', condition)
                store.commit('DEMOLEAVEFLOW_LIST_REQ_DATA', data)
                this.getDataList()
            },
            // 新增
            addData() {
                var router = this.$router
                // 如果传null，vue-router会报错
                router.push({ name: 'demoLeaveflowEdit', params: { uid: false } })
            },
            // 编辑
            editData(uid) {
                var router = this.$router
                router.push({ name: 'demoLeaveflowEdit', params: { uid: uid } })
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
            // 各模块自定义所需函数
            elDateFormat(row, column, cellValue) {
                const result = cellValue ? this.dateFormat(cellValue) : ''
                return result
            },
            // 各模块自定义所需函数
            dateFormat(date, formatStyle) {
                if (!formatStyle) {
                    formatStyle = 'YYYY-MM-DD'
                }
                return moment(date).format(formatStyle)
            }

        },
        mounted() {
            var condition = this.condition
            var store = this.$store
            // 异步数据，导致首次加载时没法加载按钮
            this.permissionArr = this.$store.state.permissions
            // 将state 字符串值 转换为数字值
            const state = this.$route.params.isClearCond >>> 0
            if (state) {
                // 不需要清除数据
                this.condition = this.$store.state.demoLeaveflow.condition
            } else {
                // 需要清除数据
                this.condition = new ConditionModel()
                store.commit('DEMOLEAVEFLOW_LIST_CONDITION', {})
                store.commit('DEMOLEAVEFLOW_LIST_REQ_DATA', condition)
            }
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
