<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <!-- test-书籍(单表)22列表 -->
            <span>{{$i('demo-test_zdy_book2')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <!-- 书籍code -->
                <el-input v-model="store.postData.bookCode" :placeholder="$i('demo-test_zdy_book2-bookCode')" @keyup.native.13="search"></el-input>
                <!-- 书籍名称 -->
                <el-input v-model="store.postData.bookName" :placeholder="$i('demo-test_zdy_book2-bookName')" @keyup.native.13="search"></el-input>
                <!-- 开始出版日期 -->
                <el-date-picker v-model="store.postData.startOutDate" type="date" :placeholder="$i('demo-test_zdy_book2-start_outDate')" :editable="false"></el-date-picker>
                <!-- 结束出版日期 -->
                <el-date-picker v-model="store.postData.endOutDate" type="date" :placeholder="$i('demo-test_zdy_book2-end_outDate')" :editable="false"></el-date-picker>
                <!-- 搜索按钮 -->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <!-- 新增按钮 -->
                <el-button type="primary" @click="addPage" v-if="permissControl('test:zdy:book2:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="deleteData()" v-if="permissControl('test:zdy:book2:mgr')"><i class="el-icon-delete"></i>{{$i("cooco_public_button_delete")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <!-- 书籍code -->
            <el-table-column header-align="center" prop="bookCode" :label="$i('demo-test_zdy_book2-bookCode')" show-overflow-tooltip></el-table-column>
            <!-- 书籍名称 -->
            <el-table-column header-align="center" prop="bookName" :label="$i('demo-test_zdy_book2-bookName')" show-overflow-tooltip></el-table-column>
            <!-- 作者 -->
            <el-table-column header-align="center" prop="author" :label="$i('demo-test_zdy_book2-author')" show-overflow-tooltip></el-table-column>
            <!-- 出版社 -->
            <el-table-column header-align="center" align="center" prop="outUnitDict" :label="$i('demo-test_zdy_book2-outUnitDict')" :formatter="translateOutUnitDict" show-overflow-tooltip></el-table-column>
            <!-- 图书类型 -->
            <el-table-column header-align="center" align="center" prop="bookTypeDict" :label="$i('demo-test_zdy_book2-bookTypeDict')" :formatter="translateBookTypeDict" show-overflow-tooltip></el-table-column>
            <!-- 作者电话 -->
            <el-table-column header-align="center" prop="authorPhone" :label="$i('demo-test_zdy_book2-authorPhone')" show-overflow-tooltip></el-table-column>
            <!-- 作者email -->
            <el-table-column header-align="center" prop="authorEmail" :label="$i('demo-test_zdy_book2-authorEmail')" show-overflow-tooltip></el-table-column>
            <!-- 作者个人url -->
            <el-table-column header-align="center" prop="authorUrl" :label="$i('demo-test_zdy_book2-authorUrl')" show-overflow-tooltip></el-table-column>
            <!-- 最后校验时间 -->
            <el-table-column header-align="center" :formatter="fm.datetime" align="center"  prop="checkTime" :label="$i('demo-test_zdy_book2-checkTime')" show-overflow-tooltip></el-table-column>
            <!-- 出版日期 -->
            <el-table-column header-align="center" :formatter="fm.date" align="center"  prop="outDate" :label="$i('demo-test_zdy_book2-outDate')" show-overflow-tooltip></el-table-column>
            <!-- 版次 -->
            <el-table-column header-align="center" align="right" prop="publishVer" :label="$i('demo-test_zdy_book2-publishVer')" show-overflow-tooltip></el-table-column>
            <!-- 市场指导价 -->
            <el-table-column header-align="center" align="right" prop="price" :label="$i('demo-test_zdy_book2-price')" show-overflow-tooltip></el-table-column>
            <!-- 是否召开发布会 -->
            <el-table-column header-align="center" align="center" prop="isFbh" :label="$i('demo-test_zdy_book2-isFbh')" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.isFbh === 1">{{$i('cooco_public_switch_yes')}}</span>
                </template>
            </el-table-column>
            <!-- 创建人姓名 -->
            <el-table-column header-align="center" prop="createUser" :label="$i('demo-test_zdy_book2-createUser')" show-overflow-tooltip></el-table-column>
            <!-- 创建时间 -->
            <el-table-column header-align="center" :formatter="fm.datetime" align="center"  prop="createTime" :label="$i('demo-test_zdy_book2-createTime')" show-overflow-tooltip></el-table-column>
            <!-- 操作列 -->
            <el-table-column header-align="center" align="center" width="100px" :label="$i('cooco_public_table_handle')" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.uid)" v-if="permissControl('test:zdy:book2:mgr')"></i>
                    <!-- 删除按钮 -->
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.uid)" v-if="permissControl('test:zdy:book2:mgr')"></i>
                    <!-- 查看按钮 -->
                    <i class="el-icon-view" :title="$i('cooco_public_button_check')" @click="viewData(scope.row.uid)" v-if="permissControl('test:zdy:book2:view')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'demo/book2/list'" :param="store"></pagination>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import formatter from '@/frame/utils/dataFormat'
    import { handleDelete, getData, translateDict } from '@/frame/utils/common'

    export default {
        data() {
            return {
                fm: formatter,
                result: {},
                store: this.$store.state.TestZdyBook2,
                router: this.$router,
                refs: this.$refs
            }
        },
        methods: {
            deleteData(singleId) {
                const param = {
                    url: 'demo/book2/virtualDeleteBatch',
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
                    url: 'demo/book2/list'
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
                this.router.push({ name: 'testZdyBook2Edit', params: { type: 'add' } })
            },
            // 编辑
            editPage(id) {
                this.store.uid = id
                this.router.push({ name: 'testZdyBook2Edit' })
            },
            viewData(id) {
                this.store.uid = id
                this.router.push({ name: 'testZdyBook2View' })
            },
            clearSearchCondition() {
                if (!this.store.keepSearchCondition) {
                    this.store.postData = {}
                }
            },
            translateOutUnitDict(row, column, cellValue) {
                return translateDict('demo-test_zdy_book2-outUnitDict', cellValue)
            },
            translateBookTypeDict(row, column, cellValue) {
                return translateDict('test_tslx', cellValue)
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
