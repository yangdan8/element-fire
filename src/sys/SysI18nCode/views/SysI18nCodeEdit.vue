<template>
    <section class="formEdit paper">
        <span class="title">
            <span>{{$i('sys-sys_i18n_code-edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysI18nCode" :rules="rules" ref="sysI18nCode" label-width="120px">
            <el-form-item :label="$i('sys-sys_i18n_code-platformTypeDict')" prop="platformTypeDict">
                <el-select v-model="sysI18nCode.platformTypeDict" clearable :placeholder="$i('cooco_public_select_placeholder')">
                    <el-option
                            v-for='item in platformTypeDict'
                            :key='item.uid'
                            :label='item.itemName'
                            :value='item.itemCode'>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-icode')" prop="icode">
                <el-input v-model="sysI18nCode.icode" auto-complete='off' v-if='!editState'></el-input>
                <span v-else>{{sysI18nCode.icode}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-zh_cn')" prop="zhCn">
                <el-input v-model="sysI18nCode.zhCn"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-zh_tw')" prop="zhTw">
                <el-input v-model="sysI18nCode.zhTw"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-en_us')" prop="enUs">
                <el-input v-model="sysI18nCode.enUs"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_i18n_code-remark')" prop="remark">
                <el-input v-model="sysI18nCode.remark"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <el-button type="primary" class="wid-btn" @click="submit('sysI18nCode')" v-if="permissControl('sys:i18n:code:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
import { SysI18nCodeModel } from '../model/SysI18nCodeModel'
import { get, post, fillDict } from '@/frame/utils/common'

export default {
    data() {
        // 判断编码是否重复
        const testIcode = (rule, value, callback) => {
            if (this.sysI18nCode.platformTypeDict) {
                post('sys/i18ncode/checkExistedByIcode', { icode: value, platformTypeDict: this.sysI18nCode.platformTypeDict }, (data) => {
                    data.isExisted ? callback(new Error('该编码被占用')) : callback()
                    return true
                }, () => {
                    callback(new Error())
                })
            } else {
                callback()
            }
        }
        return {
            editState: true,
            store: this.$store.state.SysI18nCode,
            route: this.$route,
            router: this.$router,
            refs: this.$refs,
            platformTypeDict: [],

            sysI18nCode: this.initFilter(new SysI18nCodeModel()),
            rules: {
                platformTypeDict: [
                    { // 不能为空
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    }],
                icode: [
                    {
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    { // 该编码被占用
                        validator: testIcode,
                        message: this.$i('sys-sys_i18n_code-icode') + this.$i('cooco_public_rules_beoccupied'),
                        trigger: 'blur'
                    },
                    {
                        max: 128,
                        message: this.$i('cooco_public_rules_maxlength') + '128',
                        trigger: 'blur'
                    }],
                zhCn: [
                    {
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }],
                zhTw: [
                    {
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }],
                enUs: [
                    {
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }],
                remark: [
                    {
                        max: 255,
                        message: this.$i('cooco_public_rules_maxlength') + '255',
                        trigger: 'blur'
                    }]
            }
        }
    },
    methods: {
        submit(formName) {
            this.refs[formName].validate((valid) => {
                if (valid) {
                    const data = this.sendFilter(this.sysI18nCode)
                    post('sys/i18ncode/saveOrUpdate', data, () => {
                        this.router.push({ name: 'sysI18nCode' })
                    })
                } else {
                    return false
                }
            })
        },
        getData() {
            get('sys/i18ncode/get', { uid: this.store.uid }, (data) => {
                this.sysI18nCode = this.initFilter(data.data)
                fillDict('bizplatformtype', this.platformTypeDict, this.sysI18nCode, 'platformTypeDict', false)
            })
        },
        resetData(formName) {
            var refs = this.$refs
            refs[formName].resetFields()
        },
        closeWindow() {
            this.store.keepSearchCondition = true
            this.router.push({ name: 'sysI18nCode' })
        },
        sendFilter(data) {
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
            fillDict('bizplatformtype', this.platformTypeDict, this.sysI18nCode, 'platformTypeDict', true)
        } else {
            this.store.keepSearchCondition = true
            delete this.rules.platformTypeDict
            delete this.rules.icode
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

