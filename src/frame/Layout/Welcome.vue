<template>
  <span></span>
</template>

<script>
import { $get } from '@/frame/utils/http'
export default {
    created() {
        $get('sys/welcome')
        .then(() => {
            this.$router.push('/index')
        })
    }
}
</script>

