<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <span>{{$i('act-process')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <!-- <el-col :span="16">
                <el-input v-model="store.postData.companyName" placeholder="公司名称" @keyup.native.13="search"></el-input>
                <el-date-picker v-model="store.postData.startRegisterDate" type="date" placeholder="开始注册日期" :editable="false"></el-date-picker>
                <el-date-picker v-model="store.postData.endRegisterDate" type="date" placeholder="结束注册日期" :editable="false"></el-date-picker>
                <el-button type="primary" @click="search"><i class="el-icon-search"></i> 搜索</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <el-button type="primary" @click="addPage" v-if="permissControl('demo:supplier:mgr')"><i class="el-icon-edit"></i> 新增</el-button>
                <el-button type="danger" @click="deleteData()" v-if="permissControl('demo:supplier:mgr')"><i class="el-icon-delete"></i> 删除</el-button>
            </el-col> -->
        </el-row>
        <el-table :data="result.list" max-height="700" stripe border @selection-change="handleSelectionChange">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <el-table-column header-align="center" prop="businessKey" :label="$i('act-process-businesstype')" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.businessKey | translateDictName }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="businessId" label="业务Id"  show-overflow-tooltip></el-table-column> -->
            <el-table-column header-align="center" prop="userName" :label="$i('act-process-username')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="startTime" :label="$i('demo-demo_leaveflow-starttime')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="endTime" :label="$i('demo-demo_leaveflow-endtime')" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="businessStatus" :label="$i('act-process-businessstate')" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column header-align="center" align="center" width="320px" :label="$i('cooco_public_table_handle')" v-if="permissControl('activiti:myactivity:mgr')" fixed="right">
                <template slot-scope="scope">
                    <el-button class="click-ripple" size="small" type="danger" v-if="scope.row.processStatus === 0" @click="setStauts(scope.row.processId,scope.row.processStatus)">{{$i("act-act_re_procdef-hanging")}}</el-button>
                    <el-button class="click-ripple" size="small" type="success" v-if="scope.row.processStatus > 0" @click="setStauts(scope.row.processId,scope.row.processStatus)">{{$i("act-process-startup")}}</el-button>
                    <el-button class="click-ripple" size="small" type="primary" @click="endData(scope.row.processId)">{{$i("act-process-end")}}</el-button>
                    <el-button class="click-ripple" size="small" type="primary" @click="changeUser(scope.row.processId)">{{$i("act-process-changeappr")}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sys/activitiMgr/getAllFlows'" :param="store"></pagination>

        <router-view></router-view>
        <el-dialog :title="$i('act-process-endprocess')" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="handleClose">
           <el-form :model="reviewData" :inline="true" ref="reviewData" class="demo-form-inline" label-width="16%">
                <el-form-item :label="$i('sys-sys_role-remark')">
                    <el-input v-model="reviewData.comment" ></el-input>
                     <el-input v-model="reviewData.procInstanceId" type="hidden"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="handleClose">{{$i("cooco_public_button_cancel")}}</el-button>
                <el-button type="primary" @click="save">{{$i("cooco_public_button_save")}}</el-button>
            </div>
        </el-dialog>

        <router-view></router-view>
        <el-dialog :title="$i('act-process-changeappr')" :visible.sync="showVisible" :close-on-click-modal="false" :before-close="showClose">
           <el-form :model="changeData" :inline="true" ref="changeData" class="demo-form-inline" label-width="16%">
                <el-form-item :label="$i('sys-sys_user-role')">
                    <el-checkbox-group v-model="changeData.uids" size="small">
                    <el-checkbox v-for="item in allRoleArr" :label="item.roleId" :key="item.roleId" name="type">{{ item.roleName }}</el-checkbox>
                    </el-checkbox-group>
                    <el-input v-model="changeData.procInstanceId" type="hidden"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="showClose">{{$i("cooco_public_button_cancel")}}</el-button>
                <el-button type="primary" @click="saveChange">{{$i("cooco_public_button_save")}}</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import moment from 'moment'
    import { handleDelete, getData, translateDict} from '@/frame/utils/common'
    import { $get, $postQs, $postPr } from '@/frame/utils/http'

    export default {
        computed: {
            // 多选删除，把选中行的processId存入数组
            getDeleteArr() {
                const arr = []
                this.multipleSelection.forEach((item) => {
                    arr.push(item.processId)
                })
                return arr
            }
        },
        data() {
            return {
                result: {},
                store: this.$store.state.activitManage,
                router: this.$router,
                reviewData: {},
                dialogVisible: false,
                changeData: {'procInstanceId': '', uids: []},
                showVisible: false,
                allRoleArr: [], // 所有角色
                multipleSelection: []
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            deleteData(singleId) {
                const param = {
                    url: 'codetest/activiti/myactivity/deleteBatch',
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
                    url: 'sys/activitiMgr/getAllFlows'
                }
                const renderData = async () => {
                    const data = await getData(param)
                    this.result = data
                }
                renderData()
            },
            // 权限控制
            permissControl(str) {
                return this.$store.state.permissions.indexOf(str) !== -1
            },
            // 启动/暂停
            setStauts(uid, status) {
                 $postQs('sys/activitiMgr/switchProcess', {procInstanceId: uid, supsendSize: status}).then((resdata) => {
                    if (resdata.data.code === 0) {
                        this.$message({
                            type: 'info',
                            message: resdata.data.msg
                        })
                        this.getDataList()
                    }
                })
            },
            // 直接结束
            endData(uid) {
                this.dialogVisible = true
                this.reviewData.procInstanceId = uid
                this.reviewData.comment = ''
            },
            save() {
                $postQs('sys/activitiMgr/setEnd', this.reviewData).then((resdata) => {
                    this.$message({
                        type: 'info',
                        message: resdata.data.msg
                    })
                })
                this.handleClose()
            },
            handleClose() {
                this.dialogVisible = false
            },
            // 更改审批组
            changeUser(uid) {
                this.changeData = {'procInstanceId': uid, uids: []}
                // this.changeData.procInstanceId = uid
               // this.changeData.uids = [] 写法会引起前端显示问题
                this.getAllRoleList()
                this.showVisible = true
            },
            saveChange() {
                console.log(this.changeData.uids)
                $postPr('sys/activitiMgr/changeUserGroup/' + this.changeData.procInstanceId, this.changeData.uids).then((resdata) => {
                    this.$message({
                        type: 'info',
                        message: resdata.data.msg
                    })
                })
                // const param = {
                //     url: 'demo/demo/leaveflow/changeUserGroup/' + this.changeData.procInstanceId,
                //     arr: this.changeData.uids,
                //     id: uid,
                //     callback: this.getDataList
                // }
                // handleDelete(param)
                this.showClose()
            },
            showClose() {
                this.showVisible = false
            },
            getAllRoleList() {
                $get('sys/role/select', { companyId: (this.$store.state.loginUser.companyId) ? this.$store.state.loginUser.companyId : '-1' })
                    .then((res) => {
                    if (res.data.code === 0) {
                        this.allRoleArr = res.data.list
                    }
                })
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
            renderList() {
                this.clearSearchCondition()
                this.getDataList()
            }

        },
        mounted() {
            this.renderList()
        },
        components: {
            Pagination
        },
        filters: {
            translateDictName(value) {
                return translateDict('activiti-type', value)
            }

        }
    }
</script>
