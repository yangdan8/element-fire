<template>
    <section class='formEdit paper'>
        <span class="title">
          <!--流程编辑-->
            <span>{{$i('act-act_re_model-editor')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model='formData' :rules='rules' ref='formData' label-width='120px'>
          <!--模型名称-->
            <el-form-item :label="$i('act-act_re_model-model_name')" prop='name'>
                <el-input v-model='formData.name' auto-complete='off'></el-input>
            </el-form-item>
          <!--模型KEY-->
            <el-form-item :label="$i('act-act_re_model-model_key')" prop='key'>
                <el-input v-model='formData.key' auto-complete='off'></el-input>
            </el-form-item>
          <!--版本-->
            <el-form-item :label="$i('act-act_re_model-model_version')" prop='description'>
                <el-input v-model='formData.description' auto-complete='off'></el-input>
            </el-form-item>
            <el-form-item class='footer'>
              <!--保存-->
                <el-button class="click-ripple" type='primary' @click="submitData('formData')"><i class="el-icon-upload"></i> {{$i('cooco_public_button_save')}}</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import { ModelsModel } from '@/activiti/models/model/ModelsModel'
import { color, get } from '@/frame/utils/common'
import { $postQs } from '@/frame/utils/http'

export default {
    mounted() {
        if (this.store.modelId) {
            get('activiti/model/get', { uid: this.store.modelId }, (data) => {
                this.formData = this.initFilter(data.data)
            })
        }
    },
    data() {
        return {
            color: color,
            store: this.$store.state.activitiModels,
            formData: new ModelsModel(),          
            rules: {
                name: [
                    {
                        required: true,                       
                        message: '不能为空',
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    methods: {
        submitData(formName) {
            // console.log(this.formData.remark)
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const data = this.sendFilter(this.formData)
                    if (this.store.keepSearchCondition) {
                        // this.updateData('activiti/model/edit', data)
                    } else {
                        this.updateData('activiti/model/create', data)
                    }
                } else {
                    return false
                }
            })
        },
        updateData(url, data) {
            $postQs(url, data).then((resdata) => {
                this.$router.push({ name: 'models' })
                if (resdata.data.code === 0) {
                    window.location.href = window.location.href
                    window.open(resdata.data.data)
                }
            })
        },
        resetData(formName) {
            this.$refs[formName].resetFields()
        },
        closeWindow() {
            this.store.keepSearchCondition = true
            this.$router.push({ name: 'models' })
        },
        sendFilter(data) {
            return data
        },
        initFilter(data) {
            return data
        }
    }
}
</script>
