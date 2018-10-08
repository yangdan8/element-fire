<template>
    <section class="ScrollBar">
        <div class="scroll-wrapper">
            <div class="scroll-view">
                <slot></slot>
            </div>
        </div>
    </section>
</template>

<script>
/**
 * https://blog.csdn.net/liusaint1992/article/details/51277751
 */
export default {
    'name': 'ScrollBar', // 公用组件单词首字母大写，业务组件驼峰命名
    'props': [],
    data() {
        return {
        };
    },
    'methods': {},
    'components': {},
    'filters': {},
    'watch': {},
    mounted() { }
};
</script>

<style lang="less">
.ScrollBar {
  position: relative;
  overflow: hidden;
  .scroll-wrapper {
    overflow: scroll;
    margin-right: -17px;
    margin-bottom: -17px;
  }
  .scroll-view {
    position: relative;
  }
}
</style>