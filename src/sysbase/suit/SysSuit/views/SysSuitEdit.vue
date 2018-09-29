<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 系统套餐表编辑 -->
            <span>{{$i('sysbase-sys_suit')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysSuit" :rules="rules" ref="sysSuit" label-width="120px">
            <!-- 套餐名称 -->
            <el-form-item :label="$i('sysbase-sys_suit-suitName')" prop="suitName">
                <el-input v-model="sysSuit.suitName"></el-input>
            </el-form-item>
            <!-- 套餐价格 -->
            <el-form-item :label="$i('sysbase-sys_suit-suitPrice')" prop="suitPrice">
                <el-input v-model="sysSuit.suitPrice"></el-input>
            </el-form-item>
            <!-- 套餐详细描述 -->
            <el-form-item :label="$i('sysbase-sys_suit-remark')" prop="remark">
                <el-input type="textarea" v-model="sysSuit.remark"></el-input>
            </el-form-item>
            <!-- 已售数量 -->
            <el-form-item :label="$i('sysbase-sys_suit-sellNum')" prop="sellNum">
                <el-input v-model="sysSuit.sellNum"></el-input>
            </el-form-item>
            <!-- 套餐时长 -->
            <el-form-item :label="$i('sysbase-sys_suit-validTime')" prop="validTime">
                <el-input v-model="sysSuit.validTime"></el-input>
            </el-form-item>
            <!-- 套餐图片 -->
            <el-form-item :label="$i('sysbase-sys_suit-logoImage')" prop='logoImage'>
                <el-upload class="avatar-uploader" action="sys/fileUpload2db/upload" name="files" :show-file-list="false" :on-success="handleLogoImage" :before-upload="beforeLogoImage">
                    <img v-if="sysSuit.logoImage" :src="'sys/fileUpload2db/getFile?fileId=' + sysSuit.logoImage" class="avatar" >
                    <i v-else class="material-icons upload-icon">add</i>
                </el-upload>
                <el-input v-model='sysSuit.logoImage' type="hidden"></el-input>
            </el-form-item>
            <!-- 折扣描述 -->
            <el-form-item :label="$i('sysbase-sys_suit-discount')" prop="discount">
                <el-input v-model="sysSuit.discount"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 取消按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <!-- 保存按钮 -->
            <el-button type="primary" class="wid-btn" @click="submit('sysSuit')" v-if="permissControl('sys:suit:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysSuitModel } from '../model/SysSuitModel'
    import * as $validator from '@/frame/utils/validator'
    import { get, post } from '@/frame/utils/common'

    export default {
        data() {
            return {
                editState: true,
                store: this.$store.state.SysSuit,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                sysSuit: this.initFilter(new SysSuitModel()),
                rules: {

                    suitName: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数500
                        max: 500,
                        message: this.$i('cooco_public_rules_maxlength') + '500',
                        trigger: 'blur'
                    }],
                    suitPrice: [
                    {   // 必须为数字值（整数或小数）
                        validator: $validator.testFloat,
                        message: this.$i('cooco_public_rules_float')
                    }],
                    remark: [
                    {   // 长度超出范围，最多允许字符数2000
                        max: 2000,
                        message: this.$i('cooco_public_rules_maxlength') + '2000',
                        trigger: 'blur'
                    }],
                    sellNum: [
                    {   // 请输入整数
                        validator: $validator.testNumber,
                        message: this.$i('cooco_public_rules_number')
                    }],
                    validTime: [
                    {   // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                    logoImage: [
                    {   // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                    discount: [
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
                        const data = this.sendFilter(this.sysSuit)
                        post('sysbase/suit/saveOrUpdate', data, () => {
                            this.router.push({ name: 'sysSuit' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('sysbase/suit/get', { suitId: this.store.suitId }, (data) => {
                    this.sysSuit = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysSuit' })
            },
            sendFilter(data) {
                return data
            },
            handleLogoImage(res) {
                // 图片处理
                this.sysSuit.logoImage = res['data'][0].id
            },
            beforeLogoImage(file) {
                // 图片处理
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 2
                if (!isJPG) {
                    const message = this.$i('cooco_public_uploadimage_error_jpg_format')
                    this.$message.error(message)
                }
                if (!isLt2M) {
                    const message = this.$i('cooco_public_uploadimage_error_range')
                    this.$message.error(message)
                }
                return isJPG && isLt2M
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

