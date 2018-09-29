<template>
    <section class="login">
        <h1>COOCO</h1>
        <div>
            <div>
                <el-input v-model="username" :placeholder="$i('sysbase-sys_login-name')"></el-input>
            </div>
            <div>
                <el-input type="password" v-model="password" :placeholder="$i('sysbase-sys_login-pwd')"></el-input>
            </div>
            <div>
                <el-input v-model="imageCode" :placeholder="$i('sysbase-sys_login-verification')" @keyup.enter.native="handleLogin"></el-input>
                <img :src="imgSrc" @click="refreshCode" :alt="$i('sysbase-sys_login-refresh')" />
            </div>             
            <span class="errorMsg" v-show="!!errorMsg">{{ errorMsg }}</span>
            <button class="el-button click-ripple login-button" type="button" @click="handleLogin">{{$i("sysbase-sys_login-button")}}</button>
            <span>
                <el-dropdown trigger="click">
                <div>
                    <span>{{ showLanguage }}</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu>
                <div v-for="item in lang" :key="item.key">
                    <div @click="changeLanguage(item.key)">
                        <el-dropdown-item>{{item.value}}</el-dropdown-item>
                    </div>
                </div>
            </el-dropdown-menu>
            </el-dropdown>
            </span>
            
        </div>
    </section>
</template>
<script>
import md5 from 'js-md5'
import { $postQs, $get, $IMGSERVER } from '@/frame/utils/http'
import { langList, showLang } from '@/frame/utils/common'
import bus from '@/frame/utils/eventBus'

export default {
    name: 'login',
    data() {
        return {
            username: 'admin',
            password: '123456',
            imgSrc: $IMGSERVER + 'sys/code/image?width=200',
            imageCode: '',
            errorMsg: '',
            lang: langList,
            showLanguage: showLang(this.changeLang)
        }
    },
    methods: {
        handleLogin() {
            if (!this.username || !this.password) {
                this.errorMsg = this.$i('cooco_public_login-notNull')
                return false
            }
            const data = {
                username: this.username,
                password: md5(this.password),
                imageCode: this.imageCode
            }
            // {"msg":"未知异常，请联系管理员","code":500,"data":{"errorCode":-101,"errorMsg":"账号或密码不正确"}}
            $postQs('sys/authentication/form', data)
                .then((res) => {                  
                    if (res.data.code === 0) {
                        location.replace('./')
                    } else {
                        if (res.data.data) {
                            const _error = res.data.data
                            switch (_error.errorCode) {
                                case -100:
                                    this.errorMsg = this.$i('cooco_public_login-wrongveri')
                                    this.refreshCode()
                                break
                                case -101:
                                    this.errorMsg = this.$i('cooco_public_login-wrongpwd')
                                    this.refreshCode()
                                break
                                case -201:
                                    this.errorMsg = this.$i('cooco_public_login-locked1') + _error.lockMinutes + 
                                    this.$i('cooco_public_login-locked2')
                                    this.refreshCode()
                                break
                                case -202:
                                    this.errorMsg = this.$i('cooco_public_login-wrongpwd1') + _error.lockErrorCount + 
                                    this.$i('cooco_public_login-wrongpwd2') + _error.curErrNum + 
                                    this.$i('cooco_public_login-wrongpwd3') 
                                    this.refreshCode()
                                break
                                case -300:
                                    this.errorMsg = this.$i('cooco_public_login-haslocked')
                                    this.refreshCode()
                                break
                                case -301:
                                    this.errorMsg = this.$i('cooco_public_login-jghasbanned')
                                    this.refreshCode()
                                break
                                case -302:
                                    this.errorMsg = this.$i('cooco_public_login-jghasexpired')
                                    this.refreshCode()
                                break
                                case -1009:
                                    this.open2(this.$i('cooco_public_login-islogin1') + _error.username + 
                                    this.$i('cooco_public_login-islogin2') + _error.host + 
                                    this.$i('cooco_public_login-islogin3'))
                                break
                                default :
                                 // this.errorMsg = _error.errorMsg
                                 this.errorMsg = this.$i('cooco_public_error-server500')
                                 this.refreshCode()
                            }
                        }
                    }
                })
        },
        open2(msg) {
            this.$confirm(msg, this.$i('cooco_public_login-tips'), {
                confirmButtonText: this.$i('cooco_public_button_confirm'),
                cancelButtonText: this.$i('cooco_public_button_cancel'),
                type: 'warning'
            }).then(() => {
                this.open()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$i('cooco_public_login-cancellogin')
                })
            })
        },
        open() {
            // 强制用户退出登录
            $get('sys/forceLogout?username=' + this.username)
                .then(() => {
                    // if (res.data.code === 0) {
                    this.$message({
                        type: 'info',
                        message: this.$i('cooco_public_login-forcelogout1') + this.username + this.$i('cooco_public_login-forcelogout2')
                    })
                    this.refreshCode()
                    // }
                })
        },
        refreshCode() {
            this.imgSrc = $IMGSERVER + 'sys/code/image?width=200&t=' + (+new Date())
            this.imageCode = ''
        }
    },
    mounted() {
        bus.$on('lang', (params) => {
            this.showLanguage = showLang(params)
        })
    }
}
</script>
<style lang="less">
@import "../assets/less/reset";
@import "../assets/less/public";

[v-cloak] {
  display: none;
}

section.login {
  height: 100vh;
  background: url("../assets/images/cooco-login.png");
  background-size: cover;
  padding-bottom: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .el-dropdown {
    cursor: pointer;
    color: #c3c3c3;
  }
  .el-button {
    box-shadow: none;
    color: white;
    font-size: 23px;
    border-radius: 2px;
    background-color: #289daf;
    &:hover,
    &focus {
      color: white;
      background-color: #2193a5;
    }
  }
  h1 {
    color: #eee;
    font-weight: bold;
    margin-bottom: 40px;
  }
  > div {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 400px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.21);
    padding: 30px;
    > div {
      display: flex;
      border-bottom: 1px solid #fff;
      margin: 10px 0;
      .el-input {
        width: 100%;
        .el-input__inner {
          border: none;
          height: 48px;
          background-color: transparent;
          color: #f4f4f4;
          padding: 0 20px;
        }
      }
    }
    > span {
      margin: 6px 0;
      align-items: flex-end;
      display: flex;
      justify-content: center;
      input {
        background-color: rgba(0, 0, 0, 0.1);
      }
      > img {
        font-size: 12px;
        width: 200px;
        height: 50px;
        cursor: pointer;
      }
      > .el-button {
        font-size: 14px;
        color: #20a0ff;
        flex-shrink: 0;
        display: none;
      }
      &.errorMsg {
        justify-content: space-between;
        color: #f4f4f4;
        font-size: 12px;
      }
    }
    > button {
      margin: 15px 0;
      height: 45px;
    }
  }
}

@media screen and (min-width: 720px) {
  div.login {
    > div {
      width: 330px;
      > span > .el-button {
        display: inline-block;
      }
    }
  }
}
</style>

