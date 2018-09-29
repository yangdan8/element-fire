<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <!-- 列表 -->
            <span>{{$i('sysbase-sys_suit_sell')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <!-- 开始销售时间 -->
                <el-date-picker v-model="store.postData.startCreateDate" type="date" :placeholder="$i('sysbase-sys_suit_sell-start_createDate')" :editable="false"></el-date-picker>
                <!-- 结束销售时间 -->
                <el-date-picker v-model="store.postData.endCreateDate" type="date" :placeholder="$i('sysbase-sys_suit_sell-end_createDate')" :editable="false"></el-date-picker>
                <!-- 开始套餐生效时间 -->
                <el-date-picker v-model="store.postData.startBeginDate" type="date" :placeholder="$i('sysbase-sys_suit_sell-start_beginDate')" :editable="false"></el-date-picker>
                <!-- 结束套餐生效时间 -->
                <el-date-picker v-model="store.postData.endBeginDate" type="date" :placeholder="$i('sysbase-sys_suit_sell-end_beginDate')" :editable="false"></el-date-picker>
                <!-- 开始套餐失效时间 -->
                <el-date-picker v-model="store.postData.startEndDate" type="date" :placeholder="$i('sysbase-sys_suit_sell-start_endDate')" :editable="false"></el-date-picker>
                <!-- 结束套餐失效时间 -->
                <el-date-picker v-model="store.postData.endEndDate" type="date" :placeholder="$i('sysbase-sys_suit_sell-end_endDate')" :editable="false"></el-date-picker>
                <!-- 搜索按钮 -->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <!-- 新增按钮 -->
                <el-button type="primary" @click="addPage" v-if="permissControl('sys:suit:sell:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="deleteData()" v-if="permissControl('sys:suit:sell:mgr')"><i class="el-icon-delete"></i>{{$i("cooco_public_button_delete")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <!-- 套餐ID -->
            <el-table-column header-align="center" prop="suitId" :label="$i('sysbase-sys_suit_sell-suitId')" show-overflow-tooltip></el-table-column>
            <!-- 销售时间 -->
            <el-table-column header-align="center" :formatter="fm.date" align="center"  prop="createDate" :label="$i('sysbase-sys_suit_sell-createDate')" show-overflow-tooltip></el-table-column>
            <!-- 销售人员 -->
            <el-table-column header-align="center" prop="createUser" :label="$i('sysbase-sys_suit_sell-createUser')" show-overflow-tooltip></el-table-column>
            <!-- 套餐生效时间 -->
            <el-table-column header-align="center" :formatter="fm.date" align="center"  prop="beginDate" :label="$i('sysbase-sys_suit_sell-beginDate')" show-overflow-tooltip></el-table-column>
            <!-- 套餐失效时间 -->
            <el-table-column header-align="center" :formatter="fm.date" align="center"  prop="endDate" :label="$i('sysbase-sys_suit_sell-endDate')" show-overflow-tooltip></el-table-column>
            <!-- 套餐价格 -->
            <el-table-column header-align="center" align="right" prop="suitPrice" :label="$i('sysbase-sys_suit_sell-suitPrice')" show-overflow-tooltip></el-table-column>
            <!-- 已付金额 -->
            <el-table-column header-align="center" align="right" prop="payment" :label="$i('sysbase-sys_suit_sell-payment')" show-overflow-tooltip></el-table-column>
            <!-- 支付状态 -->
            <el-table-column header-align="center" align="right" prop="payFlag" :label="$i('sysbase-sys_suit_sell-payFlag')" show-overflow-tooltip></el-table-column>
            <!-- 失效标志 -->
            <el-table-column header-align="center" align="right" prop="expiredFlag" :label="$i('sysbase-sys_suit_sell-expiredFlag')" show-overflow-tooltip></el-table-column>
            <!-- 审核人员 -->
            <el-table-column header-align="center" prop="auditUser" :label="$i('sysbase-sys_suit_sell-auditUser')" show-overflow-tooltip></el-table-column>
            <!-- 操作列 -->
            <el-table-column header-align="center" align="center" width="100px" :label="$i('cooco_public_table_handle')" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.uid)" v-if="permissControl('sys:suit:sell:mgr')"></i>
                    <!-- 删除按钮 -->
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.uid)" v-if="permissControl('sys:suit:sell:mgr')"></i>
                    <!-- 查看按钮 -->
                    <i class="el-icon-view" :title="$i('cooco_public_button_check')" @click="viewData(scope.row.uid)" v-if="permissControl('sys:suit:sell:view')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sysbase/sell/list'" :param="store"></pagination>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import formatter from '@/frame/utils/dataFormat'
    import { handleDelete, getData } from '@/frame/utils/common'

    export default {
        data() {
            return {
                fm: formatter,
                result: {},
                store: this.$store.state.SysSuitSell,
                router: this.$router,
                refs: this.$refs
            }
        },
        methods: {
            deleteData(singleId) {
                const param = {
                    url: 'sysbase/sell/deleteBatch',
                    tableObj: this.refs.tableObj,
                    id: singleId,
                    idName: 'uid',
                    callback: this.getDataList
                }
                handleDelete(param)
            },
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.store.postData,
                    url: 'sysbase/sell/list'
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
                this.router.push({ name: 'sysSuitSellEdit', params: { type: 'add' } })
            },
            // 编辑
            editPage(id) {
                this.store.uid = id
                this.router.push({ name: 'sysSuitSellEdit' })
            },
            viewData(id) {
                this.store.uid = id
                this.router.push({ name: 'sysSuitSellView' })
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
    .formList{
        justify-content: flex-start;
        width: 100%;
    }
    .el-icon-edit .el-icon-delete {
        font-size: 20px;
        color: #bcc6cd;
        margin: 0 5px;
    }
</style>
