<template>
    <section class="formEdit paper">
        <span class="title">
            <span>{{$i('sys-sys_user-edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysUser" :rules="rules" ref="sysUser" label-width="16%">
            <el-form-item :label="$i('sys-sys_user-logoId')" prop='logoUpload'><!--搜索 // 图片处理-->
                <el-upload class="avatar-uploader" :action="IMGSERVER+'sys/fileUpload2db/upload'" name="files" :show-file-list="false" :on-success="handleLogoUpload" :before-upload="beforeLogoUpload">
                    <img v-if="sysUser.logoId" :src="IMGSERVER+'sys/fileUpload2db/getFile?fileId=' + sysUser.logoId" class="avatar" >
                    <i v-else class="material-icons upload-icon">add</i>
                </el-upload>
                <el-input v-model='sysUser.logoId' type="hidden"></el-input>
                <span class="tips">{{$i('sys-sys_company-logoatt')}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_user-username')" prop="username">
                <el-input v-model="sysUser.username" auto-complete='off' v-if='!editState'></el-input>
                <span v-else>{{sysUser.username}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_user-password')" prop="password" v-if="!editState">
        <el-input v-model="sysUser.password" :type="isView ? 'text' : 'password'">
          <el-switch v-if="!editState" slot="append" v-model='isView' :active-color='color.onColor' :inactive-color='color.offColor' :active-text="$i('sys-sys_user-display')" :inactive-text="$i('sys-sys_user-hide')"></el-switch>
        </el-input>
      </el-form-item>           
            <el-form-item :label="$i('sys-sys_user-nickname')" prop="nickname">
        <el-input v-model="sysUser.nickname"></el-input>
      </el-form-item>
      <el-form-item :label="$i('sys-sys_user-mobile')" prop="mobile">
        <el-input v-model="sysUser.mobile" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$i('sys-sys_user-email')" prop="email">
        <el-input v-model="sysUser.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$i('sys-sys_user-sex')" prop="sex">
        <el-radio-group v-model="sysUser.sex">
          <el-radio :label="1">{{$i('sys-sys_user-man')}}</el-radio>
          <el-radio :label="2">{{$i('sys-sys_user-woman')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$i('sys-sys_user-status')">
        <el-switch v-model="sysUser.status" :active-color="color.onColor" :inactive-color="color.offColor" :active-text="$i('sys-sys_company-enable')" :inactive-text="$i('sys-sys_company-disable')">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$i('sys-sys_user-role')">
        <el-checkbox-group v-model="sysUser.roleIdList" size="small">
          <el-checkbox v-for="item in allRoleArr" :label="item.roleId" :key="item.roleId" name="type">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
        </el-form>
        <div class="footer">
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <el-button type="primary" class="wid-btn" @click="submit('sysUser')" v-if="permissControl('sys:user:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
import { CompanyUserModel } from '@/companyPlatform/baseConfig/companyUser/model/CompanyUserModel'
import { $get, $postQs, $IMGSERVER } from '@/frame/utils/http'
import { get, post, color } from '@/frame/utils/common'
import { testPhone } from '@/frame/utils/validator'
import md5 from 'js-md5'

export default {
    data() {
        // 自定义验证规则（函数），公司名称不能重复       
        const testUserName = (rule, value, callback) => {
            const paramJson = {
                companyId: this.$store.state.loginUser.companyId,
                userName: this.sysUser.username,
                userId: (this.editState) ? this.sysUser.userId : null
            }
            $postQs('sys/user/isExistsSameUserName', paramJson)
                .then((res) => {
                    if (res.data.code === 0) {
                        (res.data.data === true) ? callback(new Error('该帐号已被占用')) : callback()
                    } else {
                        callback()
                    }
                })
        }

        const testPassword = (rule, value, callback) => {
            if (this.sysUser.username === '') {
                callback()
            }
            if (value === '') {
                callback(new Error('密码不能为空'))
            } else {
                $postQs('sys/user/checkPasswordSecurity', {
                    userName: this.sysUser.username,
                    oldPassword: this.password,
                    newPassword: this.sysUser.password
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.data.code !== '0') {
                            callback(new Error(res.data.data.msg))
                        } else {
                            callback()
                        }
                    }
                })
            }
        }
        return {
            IMGSERVER: $IMGSERVER,
            color: color,
            editState: true,
            store: this.$store.state.companyUser,
            route: this.$route,
            router: this.$router,
            refs: this.$refs,
            sysUser: this.initFilter(new CompanyUserModel()),
            // 各自业务自定义
            allRoleArr: [], // 所有角色
            password: '',
            isView: false,
            rules: {
                username: [
                    { // 系统帐号不能为空
                        required: true,
                        message: this.$i('sys-sys_user-username') + this.$i('cooco_public_rules_notNull')
                    },
                    { // 系统账号被占用
                        validator: testUserName,
                        message: this.$i('sys-sys_user-username') + this.$i('cooco_public_rules_occupied'),
                        trigger: 'blur'
                    }, { // 长度超出范围，最多允许32个字
                        max: 32,
                        message: this.$i('cooco_public_rules_maxlength') + '32',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,                        
                        message: this.$i('sys-sys_user-password') + this.$i('cooco_public_rules_notNull')
                    },
                    {                       
                        validator: testPassword,
                        trigger: 'blur'
                    },
                    {
                        max: 16,
                        message: this.$i('cooco_public_rules_maxlength') + '16',
                        trigger: 'blur'
                    }
                ],

                email: [
                    {
                        type: 'email',
                        message: this.$i('cooco_public_rules_email')
                    },
                    {
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                mobile: [
                    {
                        validator: testPhone,
                        message: this.$i('cooco_public_rules_phone'),
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: this.$i('sys-sys_user-mobile') + this.$i('cooco_public_rules_notNull')
                    }
                ],

                nickname: [
                    {
                        required: true,
                        message: this.$i('sys-sys_user-nickname') + this.$i('cooco_public_rules_notNull')
                    },
                    {
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }]
            }
        }
    },
    methods: {
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sysUser.password = md5(this.sysUser.password)
                    const data = this.sendFilter(this.sysUser)
                    if (this.editState) {
                        post('sys/user/update', data, () => {
                            this.router.push({ name: 'companyUser' })
                        })
                    } else {
                        post('sys/user/insert', data, () => {
                            this.router.push({ name: 'companyUser' })
                        })
                    }
                } else {
                    return false
                }
            })
        },

        getData() {
            get('sys/user/getInfo', { uid: this.store.userId }, (data) => {
                this.sysUser = this.initFilter(data.user)               
                this.password = this.sysUser.password
            })
        },
        resetData(formName) {
            var refs = this.$refs
            refs[formName].resetFields()
        },
        closeWindow() {
            this.store.keepSearchCondition = true
            this.router.push({ name: 'companyUser' })
        },
        sendFilter(data) {
            // 布尔值转为数字           
            data['status'] = data['status'] >>> 0
            // 布尔值转为数字
            data['isAdmin'] = data['isAdmin'] >>> 0
            // 布尔值转为数字
            data['isSleep'] = data['isSleep'] >>> 0
            return data
        },
        initFilter(data) {
            if (!data) {
                return null
            }
            // 布尔值转为数字
            data['isAdmin'] = !!data['isAdmin']
            // 布尔值转为数字
            data['isSleep'] = !!data['isSleep']
            data['status'] = !!data['status']
            return data
        },
        // 权限控制
        permissControl(str) {
            return this.$store.state.permissions.indexOf(str) !== -1
        },
        handleLogoUpload(res) {
            // 图片处理
            this.sysUser.logoId = res['data'][0].id
        },
        beforeLogoUpload(file) {
            // 图片处理
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) { // 上传图片只能是 JPG 格式!
                 var message2 = this.$i('cooco_public_uploadimage_error_jpg_format')
                this.$message.error(message2)
            }
            if (!isLt2M) { // 上传图片大小不能超过 2MB!
                var message3 = this.$i('cooco_public_uploadimage_error_range')
                this.$message.error(message3)
            }
            return isJPG && isLt2M
        },
        // 各模块自定义函数
        getAllRoleList() {
            $get('sys/role/select', { companyId: (this.$store.state.loginUser.companyId) ? this.$store.state.loginUser.companyId : '-1' })
                .then((res) => {
                    if (res.data.code === 0) {
                        this.allRoleArr = res.data.list
                    }
                })
        }
    },
    mounted() {
        this.getAllRoleList()
        var type = this.route.params.type
        if (type === 'add') {
            this.editState = false
            this.store.keepSearchCondition = false
        } else {
            this.store.keepSearchCondition = true
            delete this.rules.username
            this.getData()
        }
    }}
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

