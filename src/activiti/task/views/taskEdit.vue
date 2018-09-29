<template>
    <section class="formEdit">
        <span class="title">
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="16%">
            <el-form-item :label="$i('demo-demo_leaveflow-leaveDate')">
                <el-date-picker v-model="formData.leaveDate" type="date" :placeholder="$i('cooco_public_datepicker_placeholder')">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$i('demo-demo_leaveflow-leaveDays')" prop="leaveDays">
                <el-input v-model.number="formData.leaveDays"></el-input>
            </el-form-item>
            <el-form-item :label="$i('demo-demo_leaveflow-reason')" prop="reason">
                <el-input v-model="formData.reason"></el-input>
            </el-form-item>
            <el-form-item class="footer">
                <el-button type="primary" @click="submitData('formData')">{{$i("cooco_public_button_save")}}</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import { DemoLeaveflowModel } from '@/activiti/Flow/model/demoLeaveflowModel'
    import { color, get, post } from '@/frame/utils/common'
    import { datetime } from '@/frame/utils/filter'
    export default {
        data() {
            return {
                color: color,
                editState: false, // 是否编辑页面
                formData: new DemoLeaveflowModel(),
                rules: {

                    companyId: [
                    {
                        max: 36,
                        message: this.$i('cooco_public_rules_maxlength') + '36',
                        trigger: 'blur'
                    }],
                    userId: [
                    {
                        max: 36,
                        message: this.$i('cooco_public_rules_maxlength') + '36',
                        trigger: 'blur'
                    }],
                    nickName: [
                    {
                        max: 32,
                        message: this.$i('cooco_public_rules_maxlength') + '32',
                        trigger: 'blur'
                    }],
                    leaveDate: [
                    {
                        type: 'date',
                        message: this.$i('cooco_public_rules_date')
                    }],
                    leaveDays: [
                    {
                        type: 'number',
                        message: this.$i('cooco_public_rules_number')
                    }],
                    reason: [
                    {
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }],
                    flowInstanceId: [
                    {
                        max: 36,
                        message: this.$i('cooco_public_rules_maxlength') + '36',
                        trigger: 'blur'
                    }],
                    flowStatus: [
                    {
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submitData(formName) {
                var refs = this.$refs
                refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.formData)
                        this.updateData('demo/demo/leaveflow/saveOrUpdate', data)
                    } else {
                        return false
                    }
                })
            },
            updateData(url, data) {
                const that = this
                const router = this.$router
                post(url, data, function() {
                    router.push({
                        name: 'demoLeaveflow',
                        params: { isClearCond: that.editState }
                    })
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                var router = this.$router
                router.push({ name: 'demoLeaveflow', params: { isClearCond: true } })
            },
            sendFilter(data) {
                data['leaveDate'] = datetime(data['leaveDate'])
                return data
            },
            initFilter(data) {
                return data
            }
        },
        mounted() {
            const uid = this.$route.params.uid
            const that = this
            if (uid) {
                get('demo/demo/leaveflow/get', { uid: uid }, function(data) {
                    that.editState = true
                    that.formData = that.initFilter(data.data)
                })
            } else {
                that.formData = that.initFilter(new DemoLeaveflowModel())
                that.resetData('formData')
            }
        }
    }
</script>
