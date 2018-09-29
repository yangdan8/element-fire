<template>
    <div class="modal-header">
        <span>{{ title }}</span>
        <i class="material-icons" @click="closeWindow">close</i>
    </div>
</template>
<script>
export default {
    props: ['modalName', 'title'],
    methods: {
        closeWindow() {
            this.$modal.hide(this.modalName)
        }
    }
}
</script>
<style lang="less" scoped>
.modal-header {
    height: 42px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7b7f80;
    background: #f9fafc;
    border-bottom: 1px solid #e8e8e8;
    i {
        cursor: pointer;
    }
}
</style>


