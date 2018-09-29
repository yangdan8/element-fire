<template>
    <el-select v-model="selectVal" clearable placeholder="请选择" :change="changeVal()">
        <el-option v-for='item in selectOpt' :key='item.uid' :label='item.itemName' :value='item.itemCode'></el-option>
    </el-select>
</template>
<script>
import { translateDict } from '@/frame/utils/common'

export default {
    props: ['result', 'dict'],
    computed: {
    },
    mounted() {
        switch (typeof this.result) {
            case 'number':
                this.selectVal = translateDict(this.dict, String(this.result))
                console.log(this.selectVal, this.result)
                break
            case 'string':
                this.selectVal = translateDict(this.dict, this.result)
                console.log('name', this.selectVal, 'code', this.result)
                break
        }
    },
    data() {
        return {
            selectOpt: this.$store.state.dictList[this.dict],
            selectVal: ''
        }
    },
    methods: {
        changeVal() {
            for (const key in this.selectOpt) {
                if (this.selectVal === this.selectOpt[key].itemCode) {
                    this.$emit('update:result', this.selectOpt[key].itemCode)
                }
            }
        }
    }
}
</script>

