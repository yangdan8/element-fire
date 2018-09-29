<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 系统套餐表查看 -->
            <span>{{$i('sysbase-sys_suit')}}{{$i('cooco_public_panel_view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysSuit" ref="sysSuit" label-width="16%">
            <!-- 套餐名称 -->
            <el-form-item :label="$i('sysbase-sys_suit-suitName')">
                <span>{{sysSuit.suitName}}</span>
            </el-form-item>
            <!-- 套餐价格 -->
            <el-form-item :label="$i('sysbase-sys_suit-suitPrice')">
                <span>{{sysSuit.suitPrice}}</span>
            </el-form-item>
            <!-- 套餐详细描述 -->
            <el-form-item :label="$i('sysbase-sys_suit-remark')">
                <span>{{sysSuit.remark}}</span>
            </el-form-item>
            <!-- 已售数量 -->
            <el-form-item :label="$i('sysbase-sys_suit-sellNum')">
                <span>{{sysSuit.sellNum}}</span>
            </el-form-item>
            <!-- 套餐时长 -->
            <el-form-item :label="$i('sysbase-sys_suit-validTime')">
                <span>{{sysSuit.validTime}}</span>
            </el-form-item>
            <!-- 套餐图片 -->
            <el-form-item :label="$i('sysbase-sys_suit-logoImage')">
                <img v-if="sysSuit.logoImage" :src="'sys/fileUpload2db/getFile?fileId=' + sysSuit.logoImage" class="avatar" >
            </el-form-item>
            <!-- 折扣描述 -->
            <el-form-item :label="$i('sysbase-sys_suit-discount')">
                <span>{{sysSuit.discount}}</span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 关闭按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysSuitModel } from '../model/SysSuitModel'
    import { get } from '@/frame/utils/common'

    export default {
        data() {
            return {
                store: this.$store.state.SysSuit,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                sysSuit: new SysSuitModel()
            }
        },
        methods: {
            getData() {
                get('sysbase/suit/get', { suitId: this.store.suitId }, (data) => {
                    this.sysSuit = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysSuit' })
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
