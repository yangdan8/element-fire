<template>
  <section>
        <div>
            <span><demo-line></demo-line></span>
            <span><demo-pie></demo-pie></span>
            <span><demo-bar></demo-bar></span>
        </div>
  </section>
</template>

<script>
import demoPie from './demoPie'
import demoLine from './demoLine'
import demoBar from './demoBar'
export default {
    components: {
        demoBar,
        demoPie,
        demoLine
    }
}
</script>
<style lang="less" scoped>
section {
    display: flex;
    flex-direction: column;
    > div {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        span {
            flex: 1;
            margin-bottom: 15px;
        }
    }
    @media screen and (min-width: 767px) {
        > div {
            display: inline-block;
            > span {
                display: inline-block;
                flex-shrink: 0;
                width: 49.5%;
                &:last-child {
                    width: 100%;
                }
            }
        } 
    }
}
</style>
