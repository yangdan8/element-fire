<template>
    <section class="formEdit paper">
        <span class="title">
            <span>系统日志编辑</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysLog" :rules="rules" ref="sysLog" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="sysLog.username"></el-input>
            </el-form-item>
            <el-form-item label="用户操作" prop="operation">
                <el-input v-model="sysLog.operation"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
                <el-input v-model="sysLog.method"></el-input>
            </el-form-item>
            <el-form-item label="请求参数" prop="params">
                <Ueditor :defaultMsg="sysLog.params" ref="params" :id="'params'"></Ueditor>
            </el-form-item>
            <el-form-item label="IP地址" prop="ip">
                <el-input v-model="sysLog.ip"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="info" @click="closeWindow" v-if="permissControl('demo:supplier:mgr')"><i class="el-icon-close"></i> 取消</el-button>
            <el-button type="primary" class="wid-btn" @click="submit('sysLog')" v-if="permissControl('sys:log:mgr')"><i class="el-icon-upload"></i> 保存</el-button>
        </div>
    </section>
</template>

<script>
    import { SysLogModel } from '@/sys/SysLog/model/SysLogModel'
    import { get, post } from '@/frame/utils/common'
    import Ueditor from '@/frame/components/Ueditor'
    export default {
        data() {
            return {
                editState: true,
                store: this.$store.state.SysLog,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                sysLog: this.initFilter(new SysLogModel()),
                rules: {

                    username: [
                    {
                        max: 50,
                        message: '长度超出范围，最多允许50个字',
                        trigger: 'blur'
                    }],
                    operation: [
                    {
                        max: 50,
                        message: '长度超出范围，最多允许50个字',
                        trigger: 'blur'
                    }],
                    method: [
                    {
                        max: 200,
                        message: '长度超出范围，最多允许200个字',
                        trigger: 'blur'
                    }],
                    params: [
                    {
                        max: 5000,
                        message: '长度超出范围，最多允许5000个字',
                        trigger: 'blur'
                    }],
                    ip: [
                    {
                        max: 64,
                        message: '长度超出范围，最多允许64个字',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submit(formName) {
                this.refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.sysLog)
                        post('sys/log/saveOrUpdate', data, () => {
                            this.router.push({ name: 'sysLog' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('sys/log/get', { id: this.store.id }, (data) => {
                    this.sysLog = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysLog' })
            },
            sendFilter(data) {
                data['params'] = this.refs.params.getUEContent()
                return data
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                return data
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
        },
        components: {
            Ueditor
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

