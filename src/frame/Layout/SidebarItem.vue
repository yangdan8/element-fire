<template>
    <div>
        <template v-for="item in routes">

            <router-link v-if="item.list == null" :to="item.url" :key="item.name">
                <el-menu-item :index="item.name" v-show="!item.isHidden" @click="test">
                    {{ menuLang(item.i18nName, item.name) }}
                </el-menu-item>
            </router-link>

            <el-submenu :index="item.name" v-else :key="item.name" v-show="!item.isHidden">
                <template slot="title">
                    <!-- .sidebar-icons提供左边栏图标样式 -->
                    <i class="material-icons sidebar-icons">{{item.icon}}</i>
                    <span v-if="!isCollapse">{{ menuLang(item.i18nName, item.name) }}</span>
                </template>

                <template v-for="child in item.list">
                    <sidebar-item v-if="child.list !== null" :routes="[child]" :key="child.name"></sidebar-item>

                    <router-link v-else :to="child.url" :key="child.name">
                        <el-menu-item :index="child.name" v-show="!child.isHidden" @click="test">
                            <div class="menu-item-icon">
                            </div>
                            <span>{{ menuLang(child.i18nName, child.name) }}</span>
                        </el-menu-item>
                    </router-link>

                </template>
            </el-submenu>
        </template>
    </div>
</template>
<!-- 替换菜单图标示例 https://material.io/icons -->
<script>
import { _setDictLang } from '@/frame/utils/common'

export default {
    name: 'SidebarItem',
    props: ['routes', 'isCollapse'],
    methods: {
        menuLang(i18n, defa) {
            return _setDictLang(i18n, defa)
        },
        test() {
            for (var objkey in this.$store.state) {
                if (this.$store.state[objkey].keepSearchCondition) {
                    this.$store.state[objkey].keepSearchCondition = false
                }
            }
        }
    }
}
</script>
