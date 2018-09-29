<template>
    <div class="modal-footer">
        <button type="button" @click="closeWindow"><i class="material-icons">close</i> 取消</button>
        <button type="button" @click="finishWindow"><i class="material-icons">check</i> 确定</button>
    </div>
</template>
<script>
export default {
    props: ['modalName'],
    methods: {
        closeWindow() {
            this.$modal.hide(this.modalName)
        },
        finishWindow() {
            this.$emit('callback', this.$store.state.Modal.output)
            this.$store.commit('CLEARMODALDATA')
            this.closeWindow()
        }
    }
}
</script>
<style lang="less" scoped>
.modal-footer {
    height: 40px;
    padding: 0 20px;
    text-align: right;
    button {
        width: 70px;
        height: 30px;
        color: #7b7f80;
        cursor: pointer;
        background-color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: 2px;
        i {
            font-size: 18px;
        }
    }
}
</style>


