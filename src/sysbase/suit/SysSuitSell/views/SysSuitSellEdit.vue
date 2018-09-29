<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 编辑 -->
            <span>{{$i('sysbase-sys_suit_sell')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysSuitSell" :rules="rules" ref="sysSuitSell" label-width="120px">
            <!-- 套餐ID -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-suitId')" prop="suitId">
                <el-input v-model="sysSuitSell.suitId"></el-input>
            </el-form-item>
            <!-- 套餐生效时间 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-beginDate')" prop="beginDate">
                <el-date-picker v-model="sysSuitSell.beginDate" type="date" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <!-- 套餐失效时间 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-endDate')" prop="endDate">
                <el-date-picker v-model="sysSuitSell.endDate" type="date" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <!-- 套餐价格 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-suitPrice')" prop="suitPrice">
                <el-input v-model="sysSuitSell.suitPrice"></el-input>
            </el-form-item>
            <!-- 已付金额 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-payment')" prop="payment">
                <el-input v-model="sysSuitSell.payment"></el-input>
            </el-form-item>
            <!-- 支付状态 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-payFlag')" prop="payFlag">
                <el-input v-model="sysSuitSell.payFlag"></el-input>
            </el-form-item>
            <!-- 失效标志 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-expiredFlag')" prop="expiredFlag">
                <el-input v-model="sysSuitSell.expiredFlag"></el-input>
            </el-form-item>
            <!-- 审核人员 -->
            <el-form-item :label="$i('sysbase-sys_suit_sell-auditUser')" prop="auditUser">
                <el-input v-model="sysSuitSell.auditUser"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 取消按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <!-- 保存按钮 -->
            <el-button type="primary" class="wid-btn" @click="submit('sysSuitSell')" v-if="permissControl('sys:suit:sell:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysSuitSellModel } from '../model/SysSuitSellModel'
    import * as $validator from '@/frame/utils/validator'
    import { get, post } from '@/frame/utils/common'

    export default {
        data() {
            return {
                editState: true,
                store: this.$store.state.SysSuitSell,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                sysSuitSell: this.initFilter(new SysSuitSellModel()),
                rules: {

                    suitId: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                    suitPrice: [
                    {   // 必须为数字值（整数或小数）
                        validator: $validator.testFloat,
                        message: this.$i('cooco_public_rules_float')
                    }],
                    payment: [
                    {   // 必须为数字值（整数或小数）
                        validator: $validator.testFloat,
                        message: this.$i('cooco_public_rules_float')
                    }],
                    payFlag: [
                    {   // 请输入整数
                        validator: $validator.testNumber,
                        message: this.$i('cooco_public_rules_number')
                    }],
                    expiredFlag: [
                    {   // 请输入整数
                        validator: $validator.testNumber,
                        message: this.$i('cooco_public_rules_number')
                    }],
                    auditUser: [
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
                        const data = this.sendFilter(this.sysSuitSell)
                        post('sysbase/sell/saveOrUpdate', data, () => {
                            this.router.push({ name: 'sysSuitSell' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('sysbase/sell/get', { uid: this.store.uid }, (data) => {
                    this.sysSuitSell = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysSuitSell' })
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

