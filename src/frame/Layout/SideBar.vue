<template>
    <aside :style="{ overflow : isCollapse ? 'inherit' : 'auto' }">
        <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse">
            <sidebar-item :routes='$store.state.menuList' :isCollapse="isCollapse"></sidebar-item>
        </el-menu>
    </aside>
</template>

<script>
import SidebarItem from './SidebarItem'
import bus from '@/frame/utils/eventBus'
import { _setMenuLang } from '@/frame/utils/common'
export default {
    data() {
        return {
            isCollapse: false
        }
    },
    methods: {
    },
    mounted() {
        // this.getSideBar()
        bus.$on('mobileMenu', (params) => {
            this.isCollapse = Boolean(!params)
        })
        bus.$on('lang', (params) => {
            this.routes = _setMenuLang(this.$store.state.menuList, params)
        })
    },
    components: {
        SidebarItem
    }
}
</script>
<style lang="less" scoped>
aside {
    padding: 20px 0;
    flex-shrink: 0;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
    .el-menu {
        border-right: none;
    }
}
</style>

