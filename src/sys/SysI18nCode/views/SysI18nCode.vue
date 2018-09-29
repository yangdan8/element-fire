<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <span>{{$i('sys-sys_i18n_code')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                 <el-select v-model="store.postData.platformTypeDict" clearable :placeholder="$i('sys-sys_i18n_code-platformTypeDict')">
                    <el-option
                            v-for='item in platformTypeDict'
                            :key='item.uid'
                            :label='item.itemName'
                            :value='item.itemCode'>
                    </el-option>                     
                </el-select>
                <el-input v-model="store.postData.icode" :placeholder="$i('sys-sys_i18n_code-icode')" @keyup.native.13="search"></el-input>
                <el-input v-model="store.postData.zhCn" :placeholder="$i('sys-sys_i18n_code-zh_cn')" @keyup.native.13="search"></el-input>
                <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}</el-button>
                <el-button type="success" @click="downLoadData()" v-if="permissControl('sys:i18n:code:mgr')"><i class="el-icon-download"></i>{{$i("sys-sys_i18n_code-upload")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <el-button type="primary" @click="addPage" v-if="permissControl('sys:i18n:code:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <el-button type="danger" @click="deleteData()" v-if="permissControl('sys:i18n:code:mgr')"><i class="el-icon-delete"></i>{{$i("cooco_public_button_delete")}}</el-button>               
            </el-col>
        </el-row>
        <el-table :data="result.list" ref="tableObj" stripe border height="600">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <el-table-column header-align="center" align="center" prop="platformTypeDict" :label="$i('sys-sys_i18n_code-platformTypeDict')" :formatter="translatePlatformTypeDict" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="icode" :label="$i('sys-sys_i18n_code-icode')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="zhCn" :label="$i('sys-sys_i18n_code-zh_cn')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="zhTw" :label="$i('sys-sys_i18n_code-zh_tw')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="enUs" :label="$i('sys-sys_i18n_code-en_us')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" prop="remark" :label="$i('sys-sys_i18n_code-remark')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" align="center" width="150px" :label="$i('cooco_public_table_handle')" fixed="right">
                <template slot-scope="scope">
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editPage(scope.row.uid)" v-if="permissControl('sys:i18n:code:mgr')"></i>
                    <i class="el-icon-delete" :title="$i('cooco_public_button_delete')" @click="deleteData(scope.row.uid)" v-if="permissControl('sys:i18n:code:mgr')"></i>
                    <i class="el-icon-view" :title="$i('cooco_public_button_check')" @click="viewData(scope.row.uid)" v-if="permissControl('sys:i18n:code:view')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sys/i18ncode/list'" :param="store"></pagination>

    </section>
</template>
<script>
import Pagination from '@/frame/components/Pagination'
import { handleDelete, getData, translateDict, fillDict } from '@/frame/utils/common'

export default {
    data() {
        return {
            result: {},
            store: this.$store.state.SysI18nCode,
            router: this.$router,
            refs: this.$refs,
            platformTypeDict: []
        }
    },
    methods: {
        deleteData(singleId) {
            const param = {
                url: 'sys/i18ncode/deleteBatch',
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
                url: 'sys/i18ncode/list'
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
            this.router.push({ name: 'sysI18nCodeEdit', params: { type: 'add' } })
        },
        // 编辑
        editPage(id) {
            this.store.uid = id
            this.router.push({ name: 'sysI18nCodeEdit' })
        },
        viewData(id) {
            this.store.uid = id
            this.router.push({ name: 'sysI18nCodeView' })
        },
        clearSearchCondition() {
            if (!this.store.keepSearchCondition) {
                this.store.postData = {}
            }
        },
        translatePlatformTypeDict(row, column, cellValue) {
            return translateDict('bizplatformtype', cellValue)
        },
        renderList() {
            this.getDataList()
        },
        downLoadData() {                   
            if (!this.store.postData.platformTypeDict) {
                this.$message({
                    type: 'error',
                    // 请先选择平台类型
                    message: this.$i('sys-sys_i18n_code-firstsel')
                })
                return
            } else {
                // window.open('sys/i18ncode/buildI18nLang?platformType=' + this.store.postData.platformTypeDict)    
                window.location.href = 'sys/i18ncode/buildI18nLang?platformType=' + this.store.postData.platformTypeDict           
            }
        }

    },
    mounted() {
        this.clearSearchCondition()
        this.renderList()
        fillDict('bizplatformtype', this.platformTypeDict, this.store.postData, 'platformTypeDict', false)
    },
    components: {
        Pagination
    }
}
</script>
<style lang="less">
.formList {
  justify-content: flex-start;
  width: 100%;
}
.el-icon-edit .el-icon-delete {
  font-size: 20px;
  color: #bcc6cd;
  margin: 0 5px;
}
</style>
