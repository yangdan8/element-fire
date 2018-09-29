<template>
    <iframe :src="baseUrl" frameborder="0" height="100%" scrolling="yes"></iframe>
</template>
<script>
export default {
    data() {
        return {
            baseUrl: ''
        }
    },
    mounted() {
        let pathname = ''
        location.pathname !== '/' ? pathname = location.pathname : pathname = ''
        this.baseUrl = location.origin + pathname + '/druid/index.html'
    }
}
</script>
