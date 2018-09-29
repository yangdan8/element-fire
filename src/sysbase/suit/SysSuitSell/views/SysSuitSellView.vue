<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 查看 -->
            <span>{{$i('sysbase-sys_suit_sell')}}{{$i('cooco_public_panel_view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysSuitSell" ref="sysSuitSell" label-width="16%">
            <!-- 套餐ID -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-suitId')">
                <span>{{sysSuitSell.suitId}}</span>
            </el-form-item>
            <!-- 套餐生效时间 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-beginDate')">
                <span>{{sysSuitSell.beginDate | dateFormat}}</span>
            </el-form-item>
            <!-- 套餐失效时间 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-endDate')">
                <span>{{sysSuitSell.endDate | dateFormat}}</span>
            </el-form-item>
            <!-- 套餐价格 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-suitPrice')">
                <span>{{sysSuitSell.suitPrice}}</span>
            </el-form-item>
            <!-- 已付金额 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-payment')">
                <span>{{sysSuitSell.payment}}</span>
            </el-form-item>
            <!-- 支付状态 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-payFlag')">
                <span>{{sysSuitSell.payFlag}}</span>
            </el-form-item>
            <!-- 失效标志 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-expiredFlag')">
                <span>{{sysSuitSell.expiredFlag}}</span>
            </el-form-item>
            <!-- 审核人员 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-auditUser')">
                <span>{{sysSuitSell.auditUser}}</span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 关闭按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysSuitSellModel } from '../model/SysSuitSellModel'
    import { get } from '@/frame/utils/common'
    import formatter from '@/frame/utils/dataFormat'

    export default {
        data() {
            return {
                store: this.$store.state.SysSuitSell,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                sysSuitSell: new SysSuitSellModel()
            }
        },
        methods: {
            getData() {
                get('sysbase/sell/get', { uid: this.store.uid }, (data) => {
                    this.sysSuitSell = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysSuitSell' })
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                return data
            }
        },
        filters: {
            dateFormat(value) {
                return formatter.date(null, null, value)
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
