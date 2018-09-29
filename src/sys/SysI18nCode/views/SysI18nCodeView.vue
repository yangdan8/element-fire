<template>
    <section class="formEdit paper">
        <span class="title">
            <span>{{$i('sys-sys_i18n_code-view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysI18nCode" ref="sysI18nCode" label-width="16%">
            <el-form-item :label="$i('sys-sys_i18n_code-platformTypeDict')">
                <span>{{sysI18nCode.platformTypeDict}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-icode')">
                <span>{{sysI18nCode.icode}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-zh_cn')">
                <span>{{sysI18nCode.zhCn}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-zh_tw')">
                <span>{{sysI18nCode.zhTw}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-en_us')">
                <span>{{sysI18nCode.enUs}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-remark')">
                <span>{{sysI18nCode.remark}}</span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysI18nCodeModel } from '../model/SysI18nCodeModel'
    import { get, translateDict } from '@/frame/utils/common'

    export default {
        data() {
            return {
                store: this.$store.state.SysI18nCode,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                sysI18nCode: new SysI18nCodeModel()
            }
        },
        methods: {
            getData() {
                get('sys/i18ncode/get', { uid: this.store.uid }, (data) => {
                    this.sysI18nCode = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysI18nCode' })
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                data['platformTypeDict'] = translateDict('bizplatformtype', data['platformTypeDict'])
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
