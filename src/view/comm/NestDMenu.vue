<template>
    <div class="NestDMenu">
        <Dropdown :placement="placement||'bottom-start'" :trigger="trigger">
            <slot></slot>
            <DropdownMenu slot="list">
                <template v-for="(item,index) in data4DMenu">
                    <template v-if="item[childrenName||'children'].length===0">
                        <!-- 菜单名 -->
                        <DropdownItem @click.native="selected(item)" :key="index">{{item[keyName||'name']}}</DropdownItem>
                    </template>
                    <template v-if="item[childrenName||'children'].length>0">
                        <!-- 递归 -->
                        <NestDMenu :model="item[childrenName||'children']" :placement="'right-start'" @on-select="selected" :trigger="trigger" :canSelectRoot="canSelectRoot" :key="index">
                            <DropdownItem @click.native="canSelectRoot?selected(item):''">{{item[keyName||'name']}}
                                <Icon type="ios-arrow-right"></Icon>
                            </DropdownItem>
                        </NestDMenu>
                    </template>
                </template>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
/**
 * 无限的嵌套下拉菜单
 * @param {Object} model 菜单数据 [{*key:'',*chlidrenKey:[]}...]
 * @param {Object} keyName 菜单名字段 默认'name'
 * @param {Object} childrenName 需递归的字段 默认'children'
 * @param {String} placement top top-start top-end bottom bottom-start bottom-end left left-start left-end right right-start right-end
 * @param {Bollean} trigger 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
 * @param {Bollean} canSelectRoot 是否可以选择父节点
 * @returns {Functon} on-select({*key:'',*chlidrenKey:[]})
 */
export default {
    'name': 'NestDMenu', // 公用组件单词首字母大写，业务组件驼峰命名
    'props': ['model', 'keyName', 'childrenName', 'placement', 'trigger', 'canSelectRoot'],
    'computed': {
        'data4DMenu': function () {
            return this.model;
        }
    },
    'methods': {
        selected(obj) {
            this.$emit('on-select', obj);
        }
    },
    'components': {},
    'filters': {},
    'watch': {},
    mounted() { }
};
</script>

<style lang="less">
.NestDMenu > .ivu-dropdown {
  display: block;
}
</style>