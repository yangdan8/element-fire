<template>
    <section class="formEdit paper">
        <span class="title">
            <span>{{$i('sys-sys_role')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysRole" :rules="rules" ref="sysRole" label-width="120px">
            <el-form-item :label="$i('sys-sys_role-roleCode')" prop="roleCode">
                <el-input v-model="sysRole.roleCode" auto-complete='off' v-if='!editState'></el-input>
                <span v-else>{{sysRole.roleCode}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_role-role_name')" prop="roleName">
                <el-input v-model="sysRole.roleName"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_code-explain')" prop="remark">
                <el-input v-model="sysRole.remark"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sysbase-sys_menu-perms')">
                <el-tree :data="roleMenuTreeData" show-checkbox default-expand-all ref="tree" highlight-current node-key="menuId" :props="defaultProps"></el-tree>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="info" @click="closeWindow" v-if="permissControl('sys:role:mgr')"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <el-button type="primary" class="wid-btn" @click="submit('sysRole')" v-if="permissControl('sys:role:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
import { SysRoleModel } from '@/companyPlatform/baseConfig/CompanyRole/model/SysRoleModel'
import { get, post, toTree, getEleCheckedKeysFromDb, getCheckNodeKeysToDb } from '@/frame/utils/common'
import { $get } from '@/frame/utils/http'

export default {
    data() {
        return {
            editState: false,
            store: this.$store.state.SysRole,
            route: this.$route,
            router: this.$router,
            refs: this.$refs,
            originalTreeDataList: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            roleMenuTreeData: [],
            checkedNodeIdsToDb: [], // 提交到后台的 已选中节点 （选中子节点时，需处理为父节点也在此数组中）
            checkedNodeIdsFromDb: [], // 数据库中获取的已选中节点（包含父子节点，需处理为ele树的要求）

            sysRole: this.initFilter(new SysRoleModel()),
            rules: {
                roleCode: [
                    { // 角色代码不能为空
                        required: true,
                        message: this.$i('sys-sys_role-roleCode') + this.$i('cooco_public_rules_notNull'),
                        trigger: 'change'
                    },
                    { // 角色代码长度不能超过15
                        max: 15,
                        message: this.$i('cooco_public_rules_maxlength') + '15',
                        trigger: 'change'
                    }
                ],
                roleName: [
                    {
                        required: true,
                        message: this.$i('sys-sys_role-role_name') + this.$i('cooco_public_rules_notNull'),
                        trigger: 'change'
                    },
                    {
                        max: 20,
                        message: this.$i('cooco_public_rules_maxlength') + '20',
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    methods: {
        submit(formName) {
            this.refs[formName].validate((valid) => {
                if (valid) {
                    const data = this.sendFilter(this.sysRole)
                    post('sys/role/saveOrUpdate', data, () => {
                        this.router.push({ name: 'companyRoleList' })
                    })
                } else {
                    return false
                }
            })
        },
        resetData(formName) {
            var refs = this.$refs
            refs[formName].resetFields()
        },
        closeWindow() {
            this.store.keepSearchCondition = true
            this.router.push({ name: 'companyRoleList' })
        },
        sendFilter(obj) {
            // 将业务数据转化为可供API传递的数据
            const data = Object.assign({}, obj)
            this.checkedNodeIdsToDb = getCheckNodeKeysToDb(this.originalTreeDataList, this.$refs.tree.getCheckedKeys(), 'menuId', 'parentId')
            data.menuIdList = this.checkedNodeIdsToDb
            return data
        },
        initFilter(data) {
            if (!data) {
                return null
            }
            return data
        },
        // 各自模块自定义
        getTreeData() {
            $get('sys/menu/perms')
                .then((res) => {
                    if (res.data.code === 0) {
                        this.originalTreeDataList = res.data.menuList
                        this.roleMenuTreeData = toTree(res.data.menuList, 'menuId', 'parentId', 0)
                    }
                })
        },
        checkNodesFromDb() {
            // console.log('从数据库获取数据，设置树节点的选中状态')
            // console.log(this.checkedNodeIdsFromDb)
            this.$refs.tree.setCheckedKeys(getEleCheckedKeysFromDb(this.originalTreeDataList, this.checkedNodeIdsFromDb, 'menuId'))
            // console.log('处理为饿了么要求的树勾选数组')
            // console.log(this.$refs.tree.getCheckedKeys())
        },
        // 权限控制
        permissControl(str) {
            return this.$store.state.permissions.indexOf(str) !== -1
        }
    },
    mounted() {
        // 获取授权树
        this.getTreeData()
        var type = this.route.params.type
        if (type === 'add') {
            this.editState = false
            this.store.keepSearchCondition = false
            // this.sysRole = this.initFilter(SysRoleModel)
            // this.resetData('sysRole')
        } else {
            this.store.keepSearchCondition = true
            delete this.rules.roleCode
            get('sys/role/info', { roleId: this.store.uid }, (data) => {
                this.editState = true
                this.sysRole = this.initFilter(data.role)
                this.checkedNodeIdsFromDb = this.sysRole.menuIdList
                // this.checkNodesFromDb()
                const _this = this
                window.setTimeout(function() {                   
                    _this.checkNodesFromDb()
                }, 1000)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.avatar-uploader {
  display: flex;
  align-items: center;
}
.avatar-uploader .el-upload {
  //   border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.footer {
  padding-left: 160px;
  .wid-btn {
    width: 120px;
    span {
      width: 58px;
    }
  }
}
</style>

