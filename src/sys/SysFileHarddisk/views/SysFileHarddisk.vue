<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <!-- 系统磁盘附件列表 -->
            <span>{{$i('demo-sys_file_harddisk')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <!-- 业务表名 -->
                <el-input v-model="store.postData.bizTableName" :placeholder="$i('demo-sys_file_harddisk-bizTableName')" @keyup.native.13="search"></el-input>
                <!-- 处理后文件名 -->
                <el-input v-model="store.postData.fileName" :placeholder="$i('demo-sys_file_harddisk-fileName')" @keyup.native.13="search"></el-input>
                <!-- 原始文件名 -->
                <el-input v-model="store.postData.originalFileName" :placeholder="$i('demo-sys_file_harddisk-originalFileName')" @keyup.native.13="search"></el-input>
                <!-- 搜索按钮 -->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <!-- 新增按钮 -->
                <el-button type="primary" @click="addPage" v-if="permissControl('sys:file:harddisk:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="deleteData()" v-if="permissControl('sys:file:harddisk:mgr')"><i class="el-icon-delete"></i>{{$i("cooco_public_button_delete")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <!-- 业务表id -->
            <el-table-column header-align="center" prop="businessId" :label="$i('demo-sys_file_harddisk-businessId')" show-overflow-tooltip></el-table-column>
            <!-- 业务表名 -->
            <el-table-column header-align="center" prop="bizTableName" :label="$i('demo-sys_file_harddisk-bizTableName')" show-overflow-tooltip></el-table-column>
            <!-- 处理后文件名 -->
            <el-table-column header-align="center" prop="fileName" :label="$i('demo-sys_file_harddisk-fileName')" show-overflow-tooltip></el-table-column>
            <!-- 原始文件名 -->
            <el-table-column header-align="center" prop="originalFileName" :label="$i('demo-sys_file_harddisk-originalFileName')" show-overflow-tooltip></el-table-column>
            <!-- 文件大小 -->
            <el-table-column header-align="center" align="right" prop="fileSize" :label="$i('demo-sys_file_harddisk-fileSize')" show-overflow-tooltip></el-table-column>
            <!-- 文件扩展名 -->
            <el-table-column header-align="center" prop="fileExtension" :label="$i('demo-sys_file_harddisk-fileExtension')" show-overflow-tooltip></el-table-column>
            <!-- 上传时间 -->
            <el-table-column header-align="center" :formatter="fm.datetime" align="center"  prop="uploadTime" :label="$i('demo-sys_file_harddisk-uploadTime')" show-overflow-tooltip></el-table-column>
            <!-- 上传人 -->
            <el-table-column header-align="center" prop="createUser" :label="$i('demo-sys_file_harddisk-createUser')" show-overflow-tooltip></el-table-column>
            <!-- 操作列 -->
            <el-table-column header-align="center" align="center" width="100px" :label="$i('cooco_public_table_handle')" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.uid)" v-if="permissControl('sys:file:harddisk:mgr')"></i>
                    <!-- 删除按钮 -->
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.uid)" v-if="permissControl('sys:file:harddisk:mgr')"></i>
                    <!-- 查看按钮 -->
                    <i class="el-icon-view" :title="$i('cooco_public_button_check')" @click="viewData(scope.row.uid)" v-if="permissControl('sys:file:harddisk:view')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'demo/harddisk/list'" :param="store"></pagination>

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
                store: this.$store.state.SysFileHarddisk,
                router: this.$router,
                refs: this.$refs
            }
        },
        methods: {
            deleteData(singleId) {
                const param = {
                    url: 'demo/harddisk/virtualDeleteBatch',
                    tableObj: this.refs.tableObj,
                    id: singleId,
                    callback: this.getDataList
                }
                handleDelete(param)
            },
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.store.postData,
                    url: 'demo/harddisk/list'
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
                this.router.push({ name: 'sysFileHarddiskEdit', params: { type: 'add' } })
            },
            // 编辑
            editPage(id) {
                this.store.uid = id
                this.router.push({ name: 'sysFileHarddiskEdit' })
            },
            viewData(id) {
                this.store.uid = id
                this.router.push({ name: 'sysFileHarddiskView' })
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
