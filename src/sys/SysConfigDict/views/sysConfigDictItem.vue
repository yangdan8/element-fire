<template>
    <section class="formList">
        <el-row  type="flex" :gutter="20">
            <el-col :span="18">
                <el-input v-model="store.postData.itemCode" :placeholder="$i('sys-sys_configdictitem-itemcode')" @keyup.native.13="search"></el-input>
                <el-input v-model="store.postData.itemName" :placeholder="$i('sys-sys_configdictitem-itemname')" @keyup.native.13="search"></el-input>
                <el-button type="primary" @click="search" v-if="permissControl('sys_configdict:view')">
                    <i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="2">
                <el-button type="primary" @click="addPage" v-if="permissControl('sys_configdict:mgr')">
                    <i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- <el-button type="danger" @click="deleteData()" v-if="permissControl('sys_configdict:mgr')">
                    <i class="el-icon-delete"></i> 删除</el-button> -->
            </el-col>
        </el-row>

        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <!-- <el-table-column type="selection" header-align="center" align="center"></el-table-column> -->
            <el-table-column header-align="center" prop="itemCode" :label="$i('sys-sys_configdictitem-itemcode')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="itemName" :label="$i('sys-sys_configdictitem-itemname')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="i18nName" :label="$i('sys-sys_configdictitem-i18nname')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" align="right" prop="orderNum" :label="$i('sysbase-sys_menu-order_num')" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column header-align="center" align="center" prop="isRemoved" label="是否废除" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.isRemoved === 1">是</span>
                </template>
            </el-table-column> -->
            <el-table-column header-align="center" align="center" prop="isDefault" :label="$i('sys-sys_configdictitem-isdefault')" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.isDefault === 1">{{$i("cooco_public_switch_yes")}}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :label="$i('cooco_public_table_handle')" width="100" fixed="right">
                <template slot-scope="scope">
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.uid)" v-if="permissControl('sys_configdict:mgr')"></i>
                   <!--  <i class="el-icon-delete" title="删除" @click="deleteData(scope.row.uid)" v-if="permissControl('sys_configdict:mgr')"></i> -->
                    <!-- <i class="el-icon-view" title="查看" @click="viewPage(scope.row.uid)" v-if="permissControl('sys_configdict:view')"></i> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sys/configDictitem/list'" :param="store" ></pagination>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import { getData } from '@/frame/utils/common'
    export default {
        watch: {
            'store.postData.categoryCode': 'renderList'
        },
        data() {
            return {
                result: {},
                store: this.$store.state.sysConfigDict,
                router: this.$router,
                refs: this.$refs
            }
        },
        methods: {
            // 获取列表数据
            getDataList() {
                console.log(this.store.postData)
                const param = {
                    data: this.store.postData,
                    url: 'sys/configDictitem/list'
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
                this.router.push({ name: 'sysConfigDictEdit', params: { type: 'add' } })
            },
            // 编辑
            editPage(id) {
                this.store.uid = id
                this.router.push({ name: 'sysConfigDictEdit' })
            },
            /* viewPage(id) {
                this.store.uid = id
                this.router.push({ name: 'sysConfigdictitemView' })
            }, */
            clearSearchCondition() {
                if (!this.store.keepSearchCondition) {
                    this.store.clearData()
                }
            },
            renderList() {
                console.info(this.store.postData.categoryCode)
                this.clearSearchCondition()
                console.info(this.store.postData.categoryCode)
                this.getDataList()
            }
        },
        mounted() {
            this.renderList()
        },
        components: {
            Pagination
        }
    }
</script>
