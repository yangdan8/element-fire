<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <!-- test-班级列表 -->
            <span>{{$i('demo-test_class')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <!-- 班级名称name -->
                <el-input v-model="store.postData.className" :placeholder="$i('demo-test_class-className')" @keyup.native.13="search"></el-input>
                <!-- 搜索按钮 -->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <!-- 新增按钮 -->
                <el-button type="primary" @click="addPage" v-if="permissControl('test:class:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="deleteData()" v-if="permissControl('test:class:mgr')"><i class="el-icon-delete"></i>{{$i("cooco_public_button_delete")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <!-- 班级名称name -->
            <el-table-column header-align="center" prop="className" :label="$i('demo-test_class-className')" show-overflow-tooltip></el-table-column>
            <!-- 人数 -->
            <el-table-column header-align="center" align="right" prop="num" :label="$i('demo-test_class-num')" show-overflow-tooltip></el-table-column>
            <!-- 负责人电话 -->
            <el-table-column header-align="center" prop="authorPhone" :label="$i('demo-test_class-authorPhone')" show-overflow-tooltip></el-table-column>
            <!-- 负责人邮件 -->
            <el-table-column header-align="center" prop="authorEmail" :label="$i('demo-test_class-authorEmail')" show-overflow-tooltip></el-table-column>
            <!-- 成立时间 -->
            <el-table-column header-align="center" :formatter="fm.datetime" align="center"  prop="createTime" :label="$i('demo-test_class-createTime')" show-overflow-tooltip></el-table-column>
            <!-- 出版社 -->
            <el-table-column header-align="center" prop="classGrade" :label="$i('demo-test_class-classGrade')" show-overflow-tooltip></el-table-column>
            <!-- 是否重点培训班级 -->
            <el-table-column header-align="center" align="center" prop="isImprove" :label="$i('demo-test_class-isImprove')" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.isImprove === 1">{{$i('cooco_public_switch_yes')}}</span>
                </template>
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column header-align="center" align="center" width="100px" :label="$i('cooco_public_table_handle')" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.id)" v-if="permissControl('test:class:mgr')"></i>
                    <!-- 删除按钮 -->
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.id)" v-if="permissControl('test:class:mgr')"></i>
                    <!-- 查看按钮 -->
                    <i class="el-icon-view" :title="$i('cooco_public_button_check')" @click="viewData(scope.row.id)" v-if="permissControl('test:class:view')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'demo/class/list'" :param="store"></pagination>

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
                store: this.$store.state.TestClass,
                router: this.$router,
                refs: this.$refs
            }
        },
        methods: {
            deleteData(singleId) {
                const param = {
                    url: 'demo/class/deleteBatch',
                    tableObj: this.refs.tableObj,
                    id: singleId,
                    idName: 'id',
                    callback: this.getDataList
                }
                handleDelete(param)
            },
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.store.postData,
                    url: 'demo/class/list'
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
                this.router.push({ name: 'testClassEdit', params: { type: 'add' } })
            },
            // 编辑
            editPage(id) {
                this.store.id = id
                this.router.push({ name: 'testClassEdit' })
            },
            viewData(id) {
                this.store.id = id
                this.router.push({ name: 'testClassView' })
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
