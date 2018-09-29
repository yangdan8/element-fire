<template>
    <section class="formList paper">
        <el-tabs type="border-card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i>{{$i('act-task-needdeal')}}</span>
                <el-row type="flex" :gutter="20">
                <el-col :span="16">
                    <el-input v-model="store.postData.taskName" :placeholder="$i('act-task-taskname')" @keyup.native.13="search"></el-input>
                    <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
                </el-col>
                </el-row>
                <el-table :data="result.list" stripe max-height="700" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" header-align="center" align="center"></el-table-column>
                    <!-- <el-table-column prop="processInstanceName" label="实例名"  show-overflow-tooltip></el-table-column> -->
                    <el-table-column header-align="center" prop="taskName" :label="$i('act-task-taskname')" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" prop="startMan" :label="$i('act-task-startman')" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" prop="startTime" :label="$i('act-task-starttime')" align="center"  show-overflow-tooltip :formatter="elDateFormat"></el-table-column>
                    <!-- <el-table-column prop="bussinessKey" label="任务类型"  show-overflow-tooltip></el-table-column>    -->
                    <el-table-column header-align="center" prop="bussinessKey" :label="$i('act-task-bussinessKey')" align="center" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.bussinessKey | translateDictName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column header-align="center" align="center" :label="$i('cooco_public_table_handle')"  fixed="right">
                        <template slot-scope="scope">
                            <el-button size="small" class="click-ripple" type="primary" @click="review(scope.row.taskId,scope.row)">{{$i("act-task-examination")}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                 <pagination :result.sync="result" :url="'sys/activitiMgr/getMyTask'" :param="store"></pagination>
            </el-tab-pane>
            <el-tab-pane :label="$i('act-task-havedeal')">
                <el-table :data="colseData.list" max-height="700" border @selection-change="handleSelectionChange">
                    <el-table-column fixed="left" type="index" :label="$i('sysbase-schedule_job-line_num')" width="50"></el-table-column>
                    <el-table-column header-align="center" prop="taskId" :label="$i('sysbase-schedule_job-job_id')" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" prop="taskName" :label="$i('act-task-taskname')" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" prop="bussinessId" :label="$i('act-task-bussinesskeyid')" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" prop="businessKey" :label="$i('act-task-bussinesskey')" align="center" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.businessKey | translateDictName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" prop="comment" :label="$i('act-task-approve')" align="center"  show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" prop="time" :label="$i('act-task-approvetime')" align="center"  show-overflow-tooltip :formatter="elDateFormat"></el-table-column>
                </el-table>
                <pagination :result.sync="colseData" :url="'sys/activitiMgr/getMyCompleteTask'"></pagination>
            </el-tab-pane>
        </el-tabs>
       <router-view></router-view>
        <el-dialog :title="$i('act-task-auditinfo')" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="handleClose">
           <el-form :model="reviewData" :rules="rules" ref="reviewData" label-width="120px">
                <el-form-item :label="$i('act-task-bussinessKey')">
                    <span>{{taskDetail.bussinessKey}}</span>
                </el-form-item>
                <el-form-item :label="$i('act-task-taskname')">
                    <span>{{taskDetail.taskName}}</span>
                </el-form-item>
                <el-form-item :label="$i('act-task-startman')">
                    <span>{{taskDetail.startMan}}</span>
                </el-form-item>
                <el-form-item :label="$i('act-task-starttime')">
                    <span>{{taskDetail.startTime}}</span>
                </el-form-item>
                <el-form-item :label="$i('demo-demo_leaveflow-reason')">
                    <span>{{taskDetail.reason}}</span>
                </el-form-item>
                <el-form-item :label="$i('demo-demo_leaveflow-leavedays')">
                    <span>{{taskDetail.leaveDays}}</span>
                </el-form-item>
                <el-form-item :label="$i('demo-demo_leaveflow-leavedate')">
                    <span>{{taskDetail.leaveDate}}</span>
                </el-form-item>
                <el-form-item :label="$i('act-task-approve')">
                    <el-input v-model="reviewData.comment" ></el-input>
                     <el-input v-model="reviewData.taskId" type="hidden"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="handleClose">{{$i("cooco_public_button_cancel")}}</el-button>
                <el-button type="primary" @click="save">{{$i("cooco_public_button_save")}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import { handleDelete, getData, get, translateDict } from '@/frame/utils/common'
    import { $postQs } from '@/frame/utils/http'
    import moment from 'moment'

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
                colseData: {},
                multipleSelection: [],
                store: this.$store.state.activitTask,
                router: this.$router,
                dialogVisible: false,
                reviewData: {},
                taskDetail: {},
                formLabelWidth: '150px',
                rules: {

                    comment: [
                    { // 公司名称不能为空
                        required: true,
                        message: this.$i('codetest-sys_company-companyName') + this.$i('cooco_public_rules_notnull'),
                        trigger: 'change'
                    }
                    ]
                }
            }
        },
        methods: {
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.store.postData,
                    url: 'sys/activitiMgr/getMyTask'
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
            // 获取已办数据
            getCloseData() {
               const param = {
                    data: {'page': 1, 'limit': 20},
                    url: 'sys/activitiMgr/getMyCompleteTask'
                }
                const renderData = async () => {
                    const data = await getData(param)
                    console.log(data)
                    this.colseData = data
                }
                renderData()
            },
            review(uid, data) {
                this.reviewData.taskId = uid
                this.taskDetail = data
                get('demo/demo/leaveflow/get', { uid: data.bussinessId }, (resdata) => {
                    if (resdata.data != null) {
                        this.taskDetail.leaveDate = resdata.data.leaveDate
                        this.taskDetail.leaveDays = resdata.data.leaveDays
                        this.taskDetail.reason = resdata.data.reason
                        this.dialogVisible = true
                    } else {
                        this.$message({
                        type: 'info',
                        message: '数据异常,请联系管理员'
                    })
                    }
                })
            },
            save() {
                this.updateData('demo/demo/leaveflow/completeTask', this.reviewData)
            },
            // 提交更新数据
            updateData(url, data) {
                $postQs(url, data, () => {
                    this.getDataList()
                    this.getCloseData()
                })
                this.dialogVisible = false
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
            this.getCloseData()
        },
        components: {
            Pagination
        },
        filters: {
            statusFilter(value) {
                return value === 0 ? '否' : '是'
            },
            translateDictName(value) {
                return translateDict('activiti-type', value)
            }

        }
    }
</script>
