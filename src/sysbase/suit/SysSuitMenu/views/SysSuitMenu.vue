<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <!-- 列表 -->
            <span>{{$i('sysbase-sys_suit_menu')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <!-- 搜索按钮 -->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <!-- 新增按钮 -->
                <el-button type="primary" @click="addPage" v-if="permissControl('sys:suit:menu:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="deleteData()" v-if="permissControl('sys:suit:menu:mgr')"><i class="el-icon-delete"></i>{{$i("cooco_public_button_delete")}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <!-- 套餐ID -->
            <el-table-column header-align="center" prop="suitId" :label="$i('sysbase-sys_suit_menu-suitId')" show-overflow-tooltip></el-table-column>
            <!-- 菜单ID -->
            <el-table-column header-align="center" prop="menuId" :label="$i('sysbase-sys_suit_menu-menuId')" show-overflow-tooltip></el-table-column>
            <!-- 操作列 -->
            <el-table-column header-align="center" align="center" width="100px" :label="$i('cooco_public_table_handle')" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.uid)" v-if="permissControl('sys:suit:menu:mgr')"></i>
                    <!-- 删除按钮 -->
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.uid)" v-if="permissControl('sys:suit:menu:mgr')"></i>
                    <!-- 查看按钮 -->
                    <i class="el-icon-view" :title="$i('cooco_public_button_check')" @click="viewData(scope.row.uid)" v-if="permissControl('sys:suit:menu:view')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sysbase/menu/list'" :param="store"></pagination>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import { handleDelete, getData } from '@/frame/utils/common'

    export default {
        data() {
            return {
                result: {},
                store: this.$store.state.SysSuitMenu,
                router: this.$router,
                refs: this.$refs
            }
        },
        methods: {
            deleteData(singleId) {
                const param = {
                    url: 'sysbase/menu/deleteBatch',
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
                    url: 'sysbase/menu/list'
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
                this.router.push({ name: 'sysSuitMenuEdit', params: { type: 'add' } })
            },
            // 编辑
            editPage(id) {
                this.store.uid = id
                this.router.push({ name: 'sysSuitMenuEdit' })
            },
            viewData(id) {
                this.store.uid = id
                this.router.push({ name: 'sysSuitMenuView' })
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
