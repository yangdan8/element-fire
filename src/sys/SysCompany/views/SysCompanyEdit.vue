<template>
    <section class="formEdit paper">
        <span class="title">
            <!--公司编辑-->
            <span>{{$i('sys-sys_company')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysCompany" :rules="rules" ref="sysCompany" label-width="16%">
            <el-form-item :label="$i('sys-sys_company-logo')" prop='logo'>
                <!--搜索 // 图片处理-->
                <el-upload class="avatar-uploader" :action="IMGSERVER+'sys/fileUpload2db/upload'" name="files" :show-file-list="false" :on-success="handleLogoUpload" :before-upload="beforeLogoUpload">
                    <img v-if="sysCompany.logo" :src="IMGSERVER+'sys/fileUpload2db/getFile?fileId=' + sysCompany.logo" class="avatar">
                    <i v-else class="material-icons upload-icon">add</i>
                </el-upload>
                <el-input v-model='sysCompany.logo' type="hidden"></el-input>
                <span class="tips">{{$i('sys-sys_company-logoAtt')}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-companyName')" prop="companyName">
                <el-input v-model="sysCompany.companyName"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-companyAddr')" prop="companyAddr">
                <el-input v-model="sysCompany.companyAddr"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-mgrMan')" prop="mgrMan">
                <el-input v-model="sysCompany.mgrMan"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-mgrEmail')" prop="mgrEmail">
                <el-input v-model="sysCompany.mgrEmail"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-mgrPhone')" prop="mgrPhone">
                <el-input v-model="sysCompany.mgrPhone"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-adminAccount')" v-show="editState">
                <span>{{sysCompany.adminAccount}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-adminAccount')" prop="adminAccount" v-show="!editState">
                <el-input v-model="sysCompany.adminAccount" auto-complete="off"></el-input>
                <div class="tips">{{$i('sys-sys_company_defaultPwd')}}</div>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-maxUserNum')" prop="maxUserNum">
                <el-input v-model.number="sysCompany.maxUserNum"></el-input>
                <div class="tips">{{$i('sys-sys_company-unlimit')}}</div>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-companyInfo')" prop="companyInfo">
                <Ueditor :defaultMsg="sysCompany.companyInfo" ref="companyInfo" :id="'companyInfo'"></Ueditor>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-registerDate')" prop="registerDate">
                <el-date-picker v-model="sysCompany.registerDate" type="date" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-disabledTime')" prop="disabledTime">
                <el-date-picker v-model="sysCompany.disabledTime" type="datetime" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_company-status')">
                <el-switch v-model="sysCompany.status" :active-color="color.onColor" :inactive-color="color.offColor" :active-text="$i('sys-sys_company-enable')" :inactive-text="$i('sys-sys_company-disable')">
                </el-switch>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="info" @click="closeWindow">
                <i class="el-icon-close"></i> {{$i("cooco_public_button_cancel")}}</el-button>
            <el-button type="primary" class="wid-btn" @click="submitData('sysCompany')" v-if="permissControl('sysCompany:mgr')">
                <i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
import { SysCompanyModel } from '@/sys/SysCompany/model/SysCompanyModel'
import * as $validator from '@/frame/utils/validator'
import { get, post, color } from '@/frame/utils/common'
import { $postQs, $IMGSERVER } from '@/frame/utils/http'
import Ueditor from '@/frame/components/Ueditor'
export default {
    data() {
        // 自定义验证规则（函数），公司名称不能重复
        const testCompanyName = (rule, value, callback) => {
            const paramJson = {
                companyName: value,
                uid: this.editState ? this.sysCompany.uid : null
            }
            $postQs('sys/company/getByCompanyName', paramJson).then(res => {
                if (res.data.code === 0) {
                    res.data.data != null
                        ? callback(new Error('该公司名被占用'))
                        : callback()
                } else {
                    callback()
                }
            })
        }
        const testUserName = (rule, value, callback) => {
            const paramJson = {
                companyId: null,
                userName: this.sysCompany.adminAccount
            }
            $postQs('sys/user/isExistsSameUserName', paramJson).then(res => {
                if (res.data.code === 0) {
                    res.data.data === true
                        ? callback(new Error('该帐号已被占用'))
                        : callback()
                } else {
                    callback()
                }
            })
        }
        return {
            IMGSERVER: $IMGSERVER,
            color: color,
            editState: true,
            store: this.$store.state.sysCompany,
            route: this.$route,
            router: this.$router,
            refs: this.$refs,
            sysCompany: this.initFilter(new SysCompanyModel()),
            rules: {
                companyName: [
                    {
                        // 公司名称不能为空
                        required: true,
                        message:
                            this.$i('sys-sys_company-companyName') +
                            this.$i('cooco_public_rules_notnull'),
                        trigger: 'change'
                    },
                    {
                        // 该公司名被占用
                        validator: testCompanyName,
                        message:
                            this.$i('sys-sys_company-companyName') +
                            this.$i('cooco_public_rules_occupied'),
                        trigger: 'blur'
                    }
                ],
                adminAccount: [
                    {
                        // 管理员账号不能为空
                        required: true,
                        message:
                            this.$i('sys-sys_company-adminAccount') +
                            this.$i('cooco_public_rules_notnull'),
                        trigger: 'change'
                    },
                    {
                        // 长度超出范围，最多允许字符数15
                        max: 15,
                        message: this.$i('cooco_public_rules_maxlength') + '15',
                        trigger: 'change'
                    },
                    {
                        // 管理员账号已被占用
                        validator: testUserName,
                        message:
                            this.$i('sys-sys_company-adminAccount') +
                            this.$i('cooco_public_rules_occupied'),
                        trigger: 'blur'
                    }
                ],
                companyAddr: [
                    {
                        // 公司地址不能为空
                        required: true,
                        message:
                            this.$i('sys-sys_company-companyAddr') +
                            this.$i('cooco_public_rules_notnull'),
                        trigger: 'blur'
                    }
                ],
                mgrMan: [
                    {
                        // 联系人不能为空
                        required: true,
                        message:
                            this.$i('sys-sys_company-mgrMan') +
                            this.$i('cooco_public_rules_notnull'),
                        trigger: 'change'
                    },
                    {
                        max: 6,
                        message: this.$i('cooco_public_rules_maxlength') + '6',
                        trigger: 'change'
                    }
                ],
                mgrEmail: [
                    {
                        // 邮箱格式不正确
                        type: 'email',
                        message: this.$i('cooco_public_rules_email'),
                        trigger: 'blur'
                    }
                ],
                mgrPhone: [
                    {
                        // 手机号码格式不正确
                        validator: $validator.testPhone,
                        message: this.$i('cooco_public_rules_phone'),
                        trigger: 'blur'
                    },
                    {
                        // 联系人号码不能为空
                        required: true,
                        message:
                            this.$i('sys-sys_company-mgrPhone') +
                            this.$i('cooco_public_rules_notnull'),
                        trigger: 'change'
                    }
                ],
                maxUserNum: [
                    // 最大用户数不能为空 最大用户数必须为数字
                    {
                        required: true,
                        message:
                            this.$i('sys-sys_company-maxUserNum') +
                            this.$i('cooco_public_rules_notnull')
                    },
                    { type: 'number', message: this.$i('cooco_public_rules_number') }
                ],
                registerDate: [
                    {
                        // 不能为空
                        type: 'string',
                        required: true,
                        trigger: 'change',
                        message: this.$i('cooco_public_rules_notnull')
                    }
                ],
                disabledTime: [
                    {
                        // 不能为空
                        type: 'string',
                        required: true,
                        trigger: 'change',
                        message: this.$i('cooco_public_rules_notnull')
                    }
                ]
            }
        }
    },
    methods: {
        submitData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const data = this.sendFilter(this.sysCompany)
                    if (this.editState) {
                        this.updateData('sys/company/update', data)
                    } else {
                        this.updateData('sys/company/insert', data)
                        this.store.keepSearchCondition = false
                    }
                } else {
                    return false
                }
            })
        },
        updateData(url, data) {
            post(url, data, () => {
                this.$router.push({ name: 'sysCompanyList' })
            })
        },
        getData() {
            get('sys/company/get', { uid: this.store.uid }, data => {
                this.sysCompany = this.initFilter(data.data)
            })
        },
        resetData(formName) {
            var refs = this.$refs
            refs[formName].resetFields()
        },
        closeWindow() {
            this.store.keepSearchCondition = true
            this.router.push({ name: 'sysCompanyList' })
        },
        sendFilter(data) {
            // 布尔值转为数字
            data['status'] = data['status'] >>> 0
            data['companyInfo'] = this.refs.companyInfo.getUEContent()
            return data
        },
        initFilter(data) {
            // 布尔值转为数字
            data['status'] = !!data['status']
            return data
        },
        handleLogoUpload(res) {
            // 图片处理
            this.sysCompany.logo = res['data'][0].id
        },
        beforeLogoUpload(file) {
            // 图片处理
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                // 上传图片只能是 JPG 格式!
                var message2 = this.$i('cooco_public_uploadimage_error_jpg_format')
                this.$message.error(message2)
            }
            if (!isLt2M) {
                // 上传图片大小不能超过 2MB!
                var message3 = this.$i('cooco_public_uploadimage_error_range')
                this.$message.error(message3)
            }
            return isJPG && isLt2M
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
            delete this.rules.adminAccount
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
  margin-left: 16%;
  padding-left: 25px;
  .wid-btn {
    width: 120px;
    span {
      width: 58px;
    }
  }
}
</style>

