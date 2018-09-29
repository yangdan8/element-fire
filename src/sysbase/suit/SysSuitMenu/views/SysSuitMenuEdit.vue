<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 编辑 -->
            <span>{{$i('sysbase-sys_suit_menu')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysSuitMenu" :rules="rules" ref="sysSuitMenu" label-width="120px">
            <!-- 套餐ID -->
            <el-form-item :label="$i('sysbase-sys_suit_menu-suitId')" prop="suitId">
                <el-input v-model="sysSuitMenu.suitId"></el-input>
            </el-form-item>
            <!-- 菜单ID -->
            <el-form-item :label="$i('sysbase-sys_suit_menu-menuId')" prop="menuId">
                <el-input v-model="sysSuitMenu.menuId"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 取消按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <!-- 保存按钮 -->
            <el-button type="primary" class="wid-btn" @click="submit('sysSuitMenu')" v-if="permissControl('sys:suit:menu:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysSuitMenuModel } from '../model/SysSuitMenuModel'
    import { get, post } from '@/frame/utils/common'

    export default {
        data() {
            return {
                editState: true,
                store: this.$store.state.SysSuitMenu,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                sysSuitMenu: this.initFilter(new SysSuitMenuModel()),
                rules: {

                    suitId: [
                    {   // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                    menuId: [
                    {   // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submit(formName) {
                this.refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.sysSuitMenu)
                        post('sysbase/menu/saveOrUpdate', data, () => {
                            this.router.push({ name: 'sysSuitMenu' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('sysbase/menu/get', { uid: this.store.uid }, (data) => {
                    this.sysSuitMenu = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysSuitMenu' })
            },
            sendFilter(data) {
                return data
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                var result = {}
                Object.assign(result, data)
                return result
            },
            // 权限控制
            permissControl(str) {
                return this.$store.state.permissions.indexOf(str) !== -1
            }
        },
        mounted() {
            var type = this.route.params.type
            if (type === 'add') {
                this.editState = false
                this.store.keepSearchCondition = false
            } else {
                this.store.keepSearchCondition = true
                this.getData()
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

