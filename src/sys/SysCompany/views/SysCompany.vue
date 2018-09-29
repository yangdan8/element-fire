<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
            <!-- 公司列表 -->
            <span>{{$i('sys-sys_company')}}</span>
        </span>
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
                <el-input v-model="store.postData.companyName" :placeholder="$i('sys-sys_company-companyName')" @keyup.native.13="search"></el-input>
                <el-date-picker v-model="store.postData.begin_registerDate" type="date" :placeholder="$i('sys-sys_company-start_registerDate')" :editable="false"></el-date-picker>
                <el-date-picker v-model="store.postData.end_registerDate" type="date" :placeholder="$i('sys-sys_company-end_registerDate')" :editable="false"></el-date-picker>
                <el-button type="primary" @click="search"><i class="el-icon-search"></i> {{$i("cooco_public_button_search")}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <el-button type="primary" @click="addPage" v-if="permissControl('sysCompany:mgr')"><i class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}</el-button>
                <!-- <el-button type="danger" @click="deleteData()" v-if="permissControl('sys:company:mgr')"><i class="el-icon-delete"></i> 删除</el-button> -->
            </el-col>
        </el-row>
        <el-table :data="result.list" stripe border height="600" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" header-align="center" align="center"></el-table-column> -->
            <!-- 公司名称 -->
            <el-table-column header-align="center" prop="companyName" :label="$i('sys-sys_company-companyName')" show-overflow-tooltip></el-table-column>
            <!-- 联系人 -->
            <el-table-column header-align="center" prop="mgrMan" :label="$i('sys-sys_company-mgrMan')" show-overflow-tooltip></el-table-column>
            <!-- 联系人手机 -->
            <el-table-column header-align="center" prop="mgrPhone" :label="$i('sys-sys_company-mgrPhone')" show-overflow-tooltip></el-table-column>
            <!-- 注册日期 -->
            <el-table-column header-align="center" :formatter="fm.date" align="center"  prop="registerDate" :label="$i('sys-sys_company-registerDate')" show-overflow-tooltip></el-table-column>
            <!-- 管理员账号 -->
            <el-table-column header-align="center" prop="adminAccount" :label="$i('sys-sys_company-adminAccount')" show-overflow-tooltip></el-table-column>
             <!-- 最大可添加用户数 -->
            <el-table-column header-align="center" align="right" prop="maxUserNum" :label="$i('sys-sys_company-maxUserNum')" show-overflow-tooltip></el-table-column>
            <!-- 注册日期 -->
            <el-table-column header-align="center" :formatter="fm.date" align="center"  prop="disabledTime" :label="$i('sys-sys_company-disabledTime')" show-overflow-tooltip></el-table-column>
            <el-table-column header-align="center" align="center" prop="status" :label="$i('sys-sys_company-status')" width="100">
                <template slot-scope="scope">
                    <span v-if="!!scope.row.status">{{ scope.row.status | statusFilter }}</span>
                    <span v-else style="color:#ff00ff">{{ scope.row.status | statusFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$i('cooco_public_table_handle')" header-align="center" align="center" fixed="right" width="120px">
                <template slot-scope="scope">
                    <i class="el-icon-edit" :title="$i('cooco_public_button_edit')" @click="editData(scope.row.uid)" v-if="permissControl('sysCompany:mgr')"></i>
                    <!-- <i class="el-icon-delete" title="删除" @click="deleteData(scope.row.uid)" v-if="permissControl('sysCompany:mgr')"></i>         -->
                    <i class="el-icon-setting" :title="$i('cooco_public_button_authority')" @click="setCommpanyPermiss(scope.row.uid)" v-if="permissControl('sysCompany:mgr')"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'sys/company/list'" :param="store"></pagination>

        <el-dialog :title="$i('sys-sys_company_authority')" :visible.sync="dialogPermissVisible" :close-on-click-modal="false">
            <el-tree :data="originalTree" show-checkbox :props="defaultProps" ref="tree" node-key="menuId" default-expand-all :expand-on-click-node="false"></el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button class="click-ripple" type="danger" @click="dialogPermissVisible = false">{{$i("cooco_public_button_cancel")}}</el-button>
                <el-button class="click-ripple" type="primary" @click="saveCommpanyPermiss">{{$i("cooco_public_button_save")}}</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import Pagination from '@/frame/components/Pagination'
    import formatter from '@/frame/utils/dataFormat'
    import { getData, getElCheckedKeys, toTree, getCheckNodeKeysToDb } from '@/frame/utils/common'
    import { $get, $postQs } from '@/frame/utils/http'

    export default {
        /* computed: {
            // 多选删除，把选中行的uid存入数组
            getDeleteArr() {
                const arr = []
                this.multipleSelection.forEach((item) => {
                    arr.push(item.uid)
                })
                return arr
            }
        }, */
        data() {
            return {
                fm: formatter,
                result: {},
                store: this.$store.state.sysCompany,
                router: this.$router,
                // 公司权限分配使用
                dialogPermissVisible: false,
                originalTreeDataList: [],
                originalTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                companyUid: '',
                checkedNodeIdsFromDb: [], // 数据库中获取的已选中节点（包含父子节点，需处理为ele树的要求）
                checkedNodeIdsToDb: [] // 提交到后台的 已选中节点 （选中子节点时，需处理为父节点也在此数组中）
                }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            // 获取列表数据
            getDataList() {
                const param = {
                    data: this.store.postData,
                    url: 'sys/company/list'
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
                this.router.push({ name: 'sysCompanyEdit', params: { type: 'add' } })
            },
            // 编辑
            editData(uid) {
                this.store.uid = uid
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysCompanyEdit' })
            },
            // 生成树型菜单
            getTreeData() {
                const param = {
                    data: {
                        excludeIsHidden: 1,
                        limit: 10000
                    },
                    url: 'sys/menu/list',
                    scope: this
                }
                const renderData = async () => {
                    const data = await getData(param)
                    this.originalTreeDataList = data.list
                    this.originalTree = this.initFilter(data.list)
                }
                renderData()
            },
             // 将API传递过来的数据转为展示数据
            initFilter(data) {
                return toTree(data, 'menuId', 'parentId', 0)
            },
             // 打开公司授权设置
            setCommpanyPermiss(uid) {
                this.companyUid = uid
                this.dialogPermissVisible = true
                $get('sys/company/getMenuCompanyList', { companyId: uid })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.checkedNodeIdsFromDb = res.data.data
                            this.$refs.tree.setCheckedKeys(getElCheckedKeys(this.originalTreeDataList, this.checkedNodeIdsFromDb, 'menuId'))
                        }
                    })
            },
            saveCommpanyPermiss() {
                const param = {
                    companyId: this.companyUid,
                    menuIds: ''
                }
                this.checkedNodeIdsToDb = getCheckNodeKeysToDb(this.originalTreeDataList, this.$refs.tree.getCheckedKeys(), 'menuId', 'parentId')
                for (let j = 0; j < this.checkedNodeIdsToDb.length; j++) {
                    param.menuIds += (this.checkedNodeIdsToDb[j] + ',')
                }
                param.menuIds = param.menuIds.slice(0, -1)
                $postQs('sys/company/saveMenuCompany', param)
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.dialogPermissVisible = false
                        }
                    })
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
            this.getTreeData()
        },
        components: {
            Pagination
        },
        filters: {
        statusFilter(value) {
            return value === 0 ? '已禁用' : '启用'
        }
    }
    }
</script>
