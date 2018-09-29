<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 查看 -->
            <span>{{$i('sysbase-sys_suit_menu')}}{{$i('cooco_public_panel_view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysSuitMenu" ref="sysSuitMenu" label-width="16%">
            <!-- 套餐ID -->
            <el-form-item :label="$i('sysbase-sys_suit_menu-suitId')">
                <span>{{sysSuitMenu.suitId}}</span>
            </el-form-item>
            <!-- 菜单ID -->
            <el-form-item :label="$i('sysbase-sys_suit_menu-menuId')">
                <span>{{sysSuitMenu.menuId}}</span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 关闭按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysSuitMenuModel } from '../model/SysSuitMenuModel'
    import { get } from '@/frame/utils/common'

    export default {
        data() {
            return {
                store: this.$store.state.SysSuitMenu,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                sysSuitMenu: new SysSuitMenuModel()
            }
        },
        methods: {
            getData() {
                get('sysbase/menu/get', { uid: this.store.uid }, (data) => {
                    this.sysSuitMenu = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysSuitMenu' })
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                return data
            }
        },
        mounted() {
            this.store.keepSearchCondition = true
            this.getData()
        }
    }
</script>
<style lang="less" scoped>
    .avatar {
        width: 178px;
        height: auto;
        display: block;
    }
    .footer {
        margin-left: 16%;
        padding-left: 28px;
        .wid-btn {
            width: 120px;
            span {
                width: 58px;
            }
        }
    }
</style>
