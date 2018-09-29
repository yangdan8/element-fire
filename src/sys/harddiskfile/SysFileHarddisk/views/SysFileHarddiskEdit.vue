<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 系统磁盘附件编辑 -->
            <span>{{$i('demo-sys_file_harddisk')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysFileHarddisk" :rules="rules" ref="sysFileHarddisk" label-width="120px">
            <!-- 业务表id -->
            <el-form-item :label="$i('demo-sys_file_harddisk-businessId')" prop="businessId">
                <el-input v-model="sysFileHarddisk.businessId"></el-input>
            </el-form-item>
            <!-- 业务表名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-bizTableName')" prop="bizTableName">
                <el-input v-model="sysFileHarddisk.bizTableName"></el-input>
            </el-form-item>
            <!-- 处理后文件名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-fileName')" prop="fileName">
                <el-input v-model="sysFileHarddisk.fileName"></el-input>
            </el-form-item>
            <!-- 原始文件名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-originalFileName')" prop="originalFileName">
                <el-input v-model="sysFileHarddisk.originalFileName"></el-input>
            </el-form-item>
            <!-- 文件大小 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-fileSize')" prop="fileSize">
                <el-input v-model="sysFileHarddisk.fileSize"></el-input>
            </el-form-item>
            <!-- 文件扩展名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-fileExtension')" prop="fileExtension">
                <el-input v-model="sysFileHarddisk.fileExtension"></el-input>
            </el-form-item>
            <!-- 下载路径 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-downPath')" prop="downPath">
                <el-input type="textarea" v-model="sysFileHarddisk.downPath"></el-input>
            </el-form-item>
            <!-- 上传时间 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-uploadTime')" prop="uploadTime">
                <el-date-picker v-model="sysFileHarddisk.uploadTime" type="datetime" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 取消按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <!-- 保存按钮 -->
            <el-button type="primary" class="wid-btn" @click="submit('sysFileHarddisk')" v-if="permissControl('sys:file:harddisk:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysFileHarddiskModel } from '../model/SysFileHarddiskModel'
    import * as $validator from '@/frame/utils/validator'
    import { get, post } from '@/frame/utils/common'

    export default {
        data() {
            return {
                editState: true,
                store: this.$store.state.SysFileHarddisk,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                sysFileHarddisk: this.initFilter(new SysFileHarddiskModel()),
                rules: {

                    businessId: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数36
                        max: 36,
                        message: this.$i('cooco_public_rules_maxlength') + '36',
                        trigger: 'blur'
                    }],
                    bizTableName: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数36
                        max: 36,
                        message: this.$i('cooco_public_rules_maxlength') + '36',
                        trigger: 'blur'
                    }],
                    fileName: [
                    {   // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                    originalFileName: [
                    {   // 长度超出范围，最多允许字符数255
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }],
                    fileSize: [
                    {   // 请输入整数
                        validator: $validator.testNumber,
                        message: this.$i('cooco_public_rules_number')
                    }],
                    fileExtension: [
                    {   // 长度超出范围，最多允许字符数36
                        max: 36,
                        message: this.$i('cooco_public_rules_maxlength') + '36',
                        trigger: 'blur'
                    }],
                    downPath: [
                    {   // 长度超出范围，最多允许字符数512
                        max: 512,
                        message: this.$i('cooco_public_rules_maxlength') + '512',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submit(formName) {
                this.refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.sysFileHarddisk)
                        post('demo/harddisk/saveOrUpdate', data, () => {
                            this.router.push({ name: 'sysFileHarddisk' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('demo/harddisk/get', { uid: this.store.uid }, (data) => {
                    this.sysFileHarddisk = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysFileHarddisk' })
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

