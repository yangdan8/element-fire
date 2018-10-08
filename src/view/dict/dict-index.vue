<template>
    <section class="dict-index">
        <keep-alive include="dict">
            <v-dict />
        </keep-alive>
    </section>
</template>

<script>
import VDict from '@/view/dict/dict.vue';
export default {
  components: { VDict },
  name: 'dict-index' // 公用组件单词首字母大写，业务组件单杠连接
};
</script>