<template>
    <section class="formEdit paper">
        <span class="title">
            <span>{{$i('demo-demo_leaveflow-edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="16%">
            <el-form-item :label="$i('demo-demo_leaveflow-leaveDate')">
                <el-date-picker v-model="formData.leaveDate" type="date" :placeholder="$i('cooco_public_datepicker_placeholder')" :picker-options='pickerOptions' :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$i('demo-demo_leaveflow-leaveDays')" prop="leaveDays">
                <el-input v-model.number="formData.leaveDays" ></el-input>
            </el-form-item>
            <el-form-item :label="$i('demo-demo_leaveflow-reason')" prop="reason">
                <el-input v-model="formData.reason"></el-input>
            </el-form-item>
            <el-form-item class="footer">
                <el-button class="click-ripple" type="primary" @click="saveOrUpdate('formData')">{{$i("cooco_public_button_save")}}</el-button>
                <el-button class="click-ripple" type="success" @click="startProcess('formData')">{{$i("cooco_public_button_launch")}}</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import { DemoLeaveflowModel } from '@/activiti/Flow/model/demoLeaveflowModel'
    import { color, get } from '@/frame/utils/common'
    import { datetime } from '@/frame/utils/filter'
    import { $postPr } from '@/frame/utils/http'

    export default {
        data() {
            return {
                color: color,
                editState: false, // 是否编辑页面
                formData: new DemoLeaveflowModel(),
                router: this.$router,
                store: this.$store.state.activitiLeaveflow,
                // 今天之前的日期不可选
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                rules: {
                    leaveDate: [
                    {
                        type: 'date',
                        message: this.$i('cooco_public_rules_date')
                    }],
                    leaveDays: [
                    { // 请输入整数
                        type: 'number',
                        message: this.$i('cooco_public_rules_number')
                    }],
                    reason: [
                    {
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            startProcess(formName) {
                var refs = this.$refs
                refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.formData)
                        this.updateData('demo/demo/leaveflow/startProcess', data)
                    } else {
                        return false
                    }
                })
            },
            saveOrUpdate(formName) {
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
                $postPr(url, data)
                .then((resdata) => {
                    this.$router.push({ name: 'leaveflowList' })
                    // console.log(resdata)
                    this.$message({
                        type: 'info',
                        message: resdata.data.msg
                    })
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'leaveflowList' })
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
            if (this.store.keepSearchCondition) {
                get('demo/demo/leaveflow/get', { uid: this.store.uid }, (data) => {
                    this.editState = true
                    this.formData = this.initFilter(data.data)
                })
            } else {
                this.formData = this.initFilter(new DemoLeaveflowModel())
                this.resetData('formData')
            }
        }
    }
</script>
