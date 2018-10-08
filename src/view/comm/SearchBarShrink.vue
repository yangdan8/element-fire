<template>
    <Button type="text" class="shrink" @click="toggle">
        {{isExpand?'收起':'展开'}}
        <Icon :type="isExpand?'ios-arrow-up':'ios-arrow-down'"></Icon>
    </Button>
</template>

<script>
export default {
    'name': 'SearchBarShrink', // 公用组件单词首字母大写，业务组件单杠连接
    'props': {},
    data() {
        return {
            'isExpand': false
        };
    },
    'methods': {
        toggle() {
            let _classList = this.$parent.$el.className.split(' ');
            const expandIdx = _classList.indexOf('expand');

            this.isExpand = expandIdx !== -1;
            if (this.isExpand) {
                _classList.splice(expandIdx);
                this.isExpand = false;
            } else {
                _classList.push('expand');
                this.isExpand = true;
            }
            this.$parent.$el.className = _classList.join(' ');
        }
    },
    mounted() {
        this.$parent.$el.className += ' shrink';
    }
};
</script>

<style lang="less" scoped>
.SearchBarShrink {
  display: inline-block;
}
</style>