<template>
    <Select v-model="selfValue" @on-change="handleChange" filterable :placeholder="placeholder" :multiple="multipleChose" class="sccs-selector-new">
        <Option v-for="item in dataSource" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
    </Select>
</template>

<script>
import { $http } from '@/services/http';
export default {
    'name': 'sccs-selector-new', // 公用组件单词首字母大写，业务组件单杠连接
    'props': {
        'value': {
            'type': [String, Array],
            'default': ''
        },
        'multiple': {
            'type': Boolean,
            'default': false
        },
        'placeholder': String
    },
    data() {
        return {
            'multipleChose': false,
            'dataSource': {},
            'selfValue': {}
        };
    },
    'computed': {},
    'methods': {
        getList() {
            // 获取当前小区不包含房间的树形结构(已加入当前人员权限控制)

            $http.postParams('v1/company/page', { 'type': '1' }).then(data => {
                this.dataSource = data.records;
            });
        },
        handleChange(val) {
            let companys = [];

            for (let i = 0; i < val.length; i++) {
                for (let y = 0; y < this.dataSource.length; y++) {
                    if (val[i] === this.dataSource[y].uid) {
                        companys.push(this.dataSource[y]);
                    }
                }
            }
            this.$emit('on-change', companys);
        }
    },
    'components': {},
    'filters': {},
    'watch': {
        'value': {
            'handler': function (val) {
                this.selfValue = val;
                this.multipleChose = this.multiple;
            },
            'immediate': true
        },
        'selfValue': function (val) {
            this.$emit('input', val);
        }
    },
    mounted() {
        this.getList();
    }
};
</script>

<style lang="less" scoped>
.sccs-selector-new {
}
</style>