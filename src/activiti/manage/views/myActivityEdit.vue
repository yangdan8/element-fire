<template>
    <section class="formEdit">
        <span class="title">
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="myActivity" :rules="rules" ref="myActivity" label-width="16%">
            <el-form-item :label="业务key" prop="businessKey">
                <el-input v-model="myActivity.businessKey"></el-input>
            </el-form-item>
            <el-form-item label="业务Id" prop="businessId">
                <el-input v-model="myActivity.businessId"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="myActivity.startTime" type="date" placeholder="选择日期" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="myActivity.endTime" type="date" placeholder="选择日期" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="myActivity.userId"></el-input>
            </el-form-item>
            <el-form-item label="申请用户" prop="userName">
                <el-input v-model="myActivity.userName"></el-input>
            </el-form-item>
            <el-form-item label="业务状态" prop="businessStatus">
                <el-input v-model="myActivity.businessStatus"></el-input>
            </el-form-item>
            <el-form-item class="footer">
                <el-button type="primary" @click="submit('myActivity')" v-if="permissControl('activiti:myactivity:mgr')">提 交</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import { MyActivityModel } from '@/activiti/manage/model/myActivityModel'
    import { get, post } from '@/frame/utils/common'
   import { datetime } from '@/frame/utils/filter'

    export default {
        data() {
            return {
                editState: true,
                store: this.$store.state.activitManage,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                myActivity: this.initFilter(new MyActivityModel()),
                rules: {

                    businessKey: [
                    {
                        max: 255,
                        message: '超出范围(0,255)',
                        trigger: 'blur'
                    }],
                    businessId: [
                    {
                        max: 64,
                        message: '超出范围(0,64)',
                        trigger: 'blur'
                    }],
                    startTime: [
                    {
                        type: 'date',
                        message: '请输入日期格式'
                    }],
                    endTime: [
                    {
                        type: 'date',
                        message: '请输入日期格式'
                    }],
                    userId: [
                    {
                        max: 32,
                        message: '超出范围(0,32)',
                        trigger: 'blur'
                    }],
                    userName: [
                    {
                        max: 255,
                        message: '超出范围(0,255)',
                        trigger: 'blur'
                    }],
                    businessStatus: [
                    {
                        max: 10,
                        message: '超出范围(0,10)',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submit(formName) {
                this.refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.myActivity)
                        post('codetest/activiti/myactivity/saveOrUpdate', data, () => {
                            this.router.push({ name: 'myActivity' })
                            this.store.keepSearchCondition = false
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('codetest/activiti/myactivity/get', { processId: this.store.processId }, (data) => {
                    this.myActivity = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'myActivity' })
            },
            sendFilter(data) {
                data['startTime'] = datetime(data['startTime'])
                data['endTime'] = datetime(data['endTime'])
                return data
            },
            initFilter(data) {
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
            } else {
                this.getData()
            }
        }
    }
</script>
<!-- 图片处理上传样式 -->
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
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
</style>

