<template>
    <section class="root" :class="mobile">
        <nav-bar class="navbar"></nav-bar>
        <section class="main">
            <side-bar class="sidebar eleme-sidebar"></side-bar>
            <section class="context">
                <!-- <level-bar></level-bar> -->
                <router-view></router-view>
                <TinyModal :status.sync="status" :title="'温馨提示'" :msg="`您购买的套餐即将过期<br /><br /><br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='http://www.baidu.com' target='_blank'>马上续费</a>`"/>
            </section>
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogModifyPassword" :show-close="canCloseDialog">
              <label slot="title">{{ '修改密码' }}</label>
              <center>
                  <div  style="color:#fa5555"  v-if="canCloseDialog==false">
                      您首次登录或长期未修改密码，为安全期间，您必须修改密码才能继续使用本系统，修改后需重新登录。
                  </div>
              </center>
              <el-form :model="modifyPasswordTable" ref="modifyPassword" class="demo-form-inline" :rules="rules">
                <el-form-item label="账号" :label-width="formLabelWidth">
                  {{ $store.state.loginUser.username }}
                </el-form-item>
                <el-form-item label="原密码" prop="oldPassword" :label-width="formLabelWidth">
                  <el-input type="password" v-model="modifyPasswordTable.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword" :label-width="formLabelWidth">
                  <el-input type="password" v-model="modifyPasswordTable.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword" :label-width="formLabelWidth">
                  <el-input type="password" v-model="modifyPasswordTable.checkPassword"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button class="click-ripple" type="danger" v-if="canCloseDialog" @click="dialogModifyPassword = false">关 闭</el-button>
                <el-button class="click-ripple" type="primary" @click="saveModifyPassword">保 存</el-button>
              </div>
            </el-dialog>

        </section>
    </section>
</template>
<script>
// import LevelBar from './LevelBar'
import NavBar from './NavBar'
import SideBar from './SideBar'
import md5 from 'js-md5'
import { $get, $postQs } from '@/frame/utils/http'
import { getScope, getMenuUser, saveDict } from '@/frame/utils/common'
import bus from '@/frame/utils/eventBus'
import TinyModal from '@/frame/components/TinyModal'

export default {
  components: {
    NavBar,
    SideBar,
    TinyModal
    // LevelBar
  },
  data() {
    // 自定义验证规则（函数），校验原密码
    const testOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    // 自定义验证规则（函数），新密码不能与旧密码一致
    const testNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.modifyPasswordTable.oldPassword) {
        callback(new Error('新密码不能与旧密码一致!'))
      } else {
        $postQs('sys/user/checkPasswordSecurity', {
          userName: this.$store.state.loginUser.username,
          oldPassword: this.modifyPasswordTable.oldPassword,
          newPassword: this.modifyPasswordTable.newPassword
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
    // 自定义验证规则（函数），新密码确认
    const testCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.modifyPasswordTable.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      show: 0,
      hide: 0,
      formLabelWidth: '120px',
      // 修改密码弹窗
      dialogModifyPassword: false,
      canCloseDialog: true,
      // 修改密码表单数据
      modifyPasswordTable: {},
      // 校验规则
      rules: {
        oldPassword: [
          {
            required: true,
            validator: testOldPassword,
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            validator: testNewPassword,
            trigger: 'blur'
          }
        ],
        checkPassword: [
          {
            required: true,
            validator: testCheckPassword,
            trigger: 'blur'
          }
        ]
      },
      mobile: '',
      status: false
    }
  },
  methods: {
    change() {
      this.status = !this.status
    },
    // 提交修改密码表单
    saveModifyPassword() {
      const newPassword = {
        userId: this.$store.state.loginUser.userId,
        username: this.$store.state.loginUser.username,
        oldPassword: md5(this.modifyPasswordTable.oldPassword),
        newPassword: md5(this.modifyPasswordTable.newPassword)
      }
      this.$refs['modifyPassword'].validate((valid) => {
        if (valid) {
          $postQs('sys/user/password', newPassword)
            .then((res) => {
              console.log(res)
              if (res.data.code === 0) {
                console.log('密码修改成功!')
                this.dialogModifyPassword = false
                this.$router.push({path: '/login'})
              } else {
                this.$message({
                  type: 'info',
                  message: '密码修改失败，' + res.data.msg
                })
              }
            })
        } else {
          return false
        }
      })
    },
    logout() {
      $get('sys/logout')
        .then((res) => {
          if (res.data.code === 0) {
            this.$router.push({path: '/login'})
          }
        })
    },
    getMenu() {
      const renderData = async () => {
        const data = await getMenuUser()
        this.$store.state.menuList = data.menuList
        this.$store.state.permissions = data.permissions
      }
      renderData()
    }
//    tips_pop() {
//      var MsgPop = document.getElementById('winpop')
//      document.getElementById('winpop').style.height = '0px'
//      var popH = parseInt(MsgPop.style.height)
//      if (popH === 0) {
//        MsgPop.style.display = 'block'
//        this.show = setInterval(this.changeH('up'), 2)
//      } else {
//        this.hide = setInterval(this.changeH('down'), 2)
//      }
//    },
//    changeH(str) {
//      var MsgPop = document.getElementById('winpop')
//      var popH = parseInt(MsgPop.style.height)
//      if (str === 'up') {
//        if (popH <= 100) {
//          MsgPop.style.height = (popH + 4).toString() + 'px'
//        } else {
//          clearInterval(this.show)
//        }
//      }
//      if (str === 'down') {
//        if (popH >= 4) {
//          MsgPop.style.height = (popH - 4).toString() + 'px'
//        } else {
//          clearInterval(this.hide)
//          MsgPop.style.display = 'none'
//        }
//      }
//    }
  },
  mounted() {
    getScope(this)
    this.getMenu()
    saveDict()
    // 获取用户信息
    $get('sys/user/info')
      .then((res) => {
        if (res.data.code === 0) {
          this.$store.state.loginUser = res.data.user
          if (res.data.handleMap.mustModifyPwd === true) {
            this.dialogModifyPassword = true
            this.canCloseDialog = false
          }
          if (res.data.user.logoId) {
            this.$store.state.loginUser.logoId = 'sys/fileUpload2db/getFile?fileId=' + res.data.user.logoId
          } else {
            this.$store.state.loginUser.logoId = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
          }
          if (this.$store.state.loginUser.sysCompany) {
            var disableDate = new Date(Date.parse(this.$store.state.loginUser.sysCompany.disabledTime))
            disableDate.setDate(disableDate.getDate() + 10)
            var nowDate = new Date()
            if (disableDate > nowDate) {
              this.change()
            }
            console.info('asdfasdfsadf')
          }
        }
      })
    bus.$on('mobileMenu', (params) => {
      this.mobile = params
    })

//    this.tips_pop()
//        window.onload = function() {
//          new Pop('这里是标题，哈哈', 'http://www.yanue.info/js/pop/pop.html', '请输入你的内容简介，这里是内容简介.请输入你的内容简介，这里是内容简介.请输入你的内容简介，这里是内容简介')
//        }
  }
}
</script>
