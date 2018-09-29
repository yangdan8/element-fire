<template>
  <nav>
      <div class="logo" v-if="mobile">
          <div>
            <img v-if="$store.state.loginUser.sysCompany && $store.state.loginUser.sysCompany.logo" :src="'sys/fileUpload2db/getFile?fileId=' + $store.state.loginUser.sysCompany.logo" class="avatar" width="180" height="42">
            <img v-else src="../assets/images/cooco-logo.png">
          </div>
      </div>
      <div class="logo" style="width:65px" v-if="!mobile">
          <div>
            <img v-if="$store.state.loginUser.sysCompany && $store.state.loginUser.sysCompany.logo" :src="'sys/fileUpload2db/getFile?fileId=' + $store.state.loginUser.sysCompany.logo" class="avatar" width="31" height="32">
            <img v-else src="../assets/images/simple-logo.png">
          </div>
      </div>

      <span class="collapse-icon" @click="sendMsg"><i class="material-icons">dehaze</i></span>

      <div class="logo logo-mobile">
          <img v-if="$store.state.loginUser.sysCompany && $store.state.loginUser.sysCompany.logo" :src="'sys/fileUpload2db/getFile?fileId=' + $store.state.loginUser.sysCompany.logo" class="avatar" width="180" height="42">
          <img v-else src="../assets/images/cooco-logo.png">
      </div>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img :src="$store.state.loginUser.logoId"/>
                <span class="nick">{{ $store.state.loginUser.nickname }}</span>
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class='inlineBlock' to="/">
                    <el-dropdown-item>
                        <i class="material-icons">home</i>首页
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item><span @click="modifyPassword"><i class="material-icons">person</i>修改密码</span></el-dropdown-item>
                <el-dropdown-item divided><span @click="logout"><i class="material-icons">exit_to_app</i>退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
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
  </nav>
</template>
<script>

import bus from '@/frame/utils/eventBus'
import { langList, showLang } from '@/frame/utils/common'
export default {
    data() {
        return {
            mobile: 'mobile',
            lang: langList,
            showLanguage: showLang(this.changeLang)
        }
    },
    methods: {
        modifyPassword() {
            this.$parent.dialogModifyPassword = true
            this.$parent.modifyPasswordTable = {
                userId: this.$store.state.loginUser.userId,
                oldPassword: '',
                newPassword: '',
                checkPassword: ''
            }
        },
        logout() {
            this.$parent.logout()
            // console.log('注销')
        },
        sendMsg() {
            if (this.mobile === 'mobile') {
                this.mobile = ''
            } else {
                this.mobile = 'mobile'
            }
            bus.$emit('mobileMenu', this.mobile)
        }
    },
    mounted() {
        bus.$on('lang', (params) => {
            this.showLanguage = showLang(params)
        })
    }
}
</script>
<style lang="less" scoped>
nav {
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: #eef1f6;
  .collapse-icon {
    cursor: pointer;
    margin: 0 20px;
    display: flex;
  }
  > div {
    img {
      cursor: pointer;
    }
    display: flex;
    flex-direction: row;
    justify-content: center;
    > span {
      cursor: pointer;
      color: #5a5e66;
    }
  }
  .logo {
    cursor: pointer;
    align-items: center;
    justify-content: flex-end;
    > div {
        width: 100%;
        justify-content: center;
        display: flex;
    }
    &.logo-mobile {
      flex: 1;
      img {
        display: none;
      }
    }
    width: 230px;
    font-size: 32px;
    display: flex;
  }
  .avatar-wrapper {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
      margin-right: 10px;
    }
  }
  .el-dropdown{
      margin-right: 20px;
      cursor: pointer;
  }
  .nick {
    display: none;
  }
  .i18n{
      display: unset!important;
  }
  @media screen and (min-width: 767px) {
    .nick {
      display: inline-block;
      margin-right: 10px;
    }
  }
  @media screen and (max-width: 767px) {
    .logo {
      display: none;
      &.logo-mobile {
        img {
          display: flex;
        }
        display: flex;
        border: none;
        justify-content: center;
      }
    }
  }
}
</style>

