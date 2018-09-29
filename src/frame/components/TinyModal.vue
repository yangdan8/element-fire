<template>
  <div class="tiny-modal" :class="status ? '' : 'active'">
    <div class="header">
      <span>{{ title ? title : '' }}</span>
      <i class="close" @click="closeModal">关闭</i>
    </div>
    <div class="msg" v-html="msg"></div>
  </div>
</template>
<script>
  export default {
    name: 'tiny-modal',
    props: ['status', 'title', 'msg'],
    methods: {
      closeModal() {
        this.$emit('update:status', this.changeStatus())
      },
      changeStatus() {
        return !this.status
      }
    }
  }
</script>
<style lang="less" scoped>
  .tiny-modal {
    z-index: 100;
    width: 220px;
    height: 220px;
    background: #fff;
    border: 1px solid red;
    position: fixed;
    right: 50px;
    bottom: 0;
    transition: ease 0.6s all;
    &.active {
      transform: translateY(100%);
    }
    .header {
      height: 20px;
      width: 100%;
      border: 1px solid green;
      display: inline-flex;
      position: relative;
      span {
        flex: 1;
      }
      i {
        position: absolute;
        right: 0;
        width: 40px;
        height: 100%;
        font-style: normal;
        font-size: 12px;
        align-items: center;
        display: inline-flex;
        justify-content: center;
      }
    }
    .msg {
      padding: 20px;
      box-sizing: border-box;
      text-align: left;
    }
  }
</style>
