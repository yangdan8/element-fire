<template>
    <Layout style="height: 100%" class="main">
        <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
            <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList" v-if="isShowMenu">
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con" style="background: rgb(39,42,42)">
                    <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
                    <img v-show="collapsed" :src="minLogo" key="min-logo" />
                </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
                    <user :user-avator="userAvator" />
                    <!-- <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local" /> -->
                    <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
                </header-bar>
            </Header>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <!-- <div class="tag-nav-wrapper">
                        <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
                    </div> -->
                    <Content class="content-wrapper">
                        <keep-alive :include="cacheList">
                            <router-view />
                        </keep-alive>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import TagsNav from './components/tags-nav';
import User from './components/user';
import Fullscreen from './components/fullscreen';
import Language from './components/language';
import { mapMutations, mapActions } from 'vuex';
import {
    getNewTagList,
    getNextRoute,
    routeEqual,
    getMenuByRouter
} from '@/libs/util';
import routers from '@/router/routers';
import myRoutes from '@/mockData/menus.json';
import minLogo from '@/assets/images/logo-xiao.jpg';
import maxLogo from '@/assets/images/logo-big.jpg';
import './main.less';
export default {
    'name': 'Main',
    'components': {
        SideMenu,
        HeaderBar,
        Language,
        TagsNav,
        Fullscreen,
        User
    },
    data() {
        return {
            'collapsed': false,
            minLogo,
            maxLogo,
            'isFullscreen': false,
            'isShowMenu': false
        };
    },
    'computed': {
        tagNavList() {
            return this.$store.state.app.tagNavList;
        },
        tagRouter() {
            return this.$store.state.app.tagRouter;
        },
        userAvator() {
            return this.$store.state.user.avatorImgPath;
        },
        cacheList() {
            return this.tagNavList.length ?
                this.tagNavList
                    .filter(item => !(item.meta && item.meta.notCache))
                    .map(item => item.name) :
                [];
        },
        menuList() {
            return this.$store.state.menuList;
        },
        local() {
            return this.$store.state.app.local;
        }
    },
    'methods': {
        ...mapMutations(['setBreadCrumb', 'setTagNavList', 'addTag', 'setLocal']),
        ...mapActions(['handleLogin']),
        turnToPage(route) {
            let { name, params, query } = {};

            if (typeof route === 'string') {
                name = route;
            } else {
                name = route.name;
                params = route.params;
                query = route.query;
            }
            if (name.indexOf('isTurnByHref_') > -1) {
                window.open(name.split('_')[1]);
                return;
            }
            this.$router.push({
                name,
                params,
                query
            });
        },
        handleCollapsedChange(state) {
            this.collapsed = state;
        },
        handleCloseTag(res, type, route) {
            if (type === 'all') {
                this.turnToPage('home');
            } else if (routeEqual(this.$route, route)) {
                if (type === 'others') {
                } else {
                    const nextRoute = getNextRoute(this.tagNavList, route);

                    this.$router.push(nextRoute);
                }
            }
            this.setTagNavList(res);
        },
        handleClick(item) {
            this.turnToPage(item);
        }
    },
    'watch': {
        $route(newRoute) {
            const { name, query, params, meta } = newRoute;

            this.addTag({
                'route': { name, query, params, meta },
                'type': 'push'
            });
            this.setBreadCrumb(newRoute);
            this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
            this.$refs.sideMenu.updateOpenName(newRoute.name);
        }
    },
    mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
        this.setTagNavList();
        this.addTag({
            'route': this.$store.state.app.homeRoute
        });
        this.setBreadCrumb(this.$route);
        // 设置初始语言
        this.setLocal(this.$i18n.locale);
        // 文档提示
        // this.$Notice.info({
        //     'title': '想快速上手，去看文档吧',
        //     'duration': 0,
        //     'render': h => {
        //         return h(
        //             'p',
        //             {
        //                 'style': {
        //                     'fontSize': '13px'
        //                 }
        //             },
        //             [
        //                 '点击',
        //                 h(
        //                     'a',
        //                     {
        //                         'attrs': {
        //                             'href': 'https://lison16.github.io/iview-admin-doc/#/',
        //                             'target': '_blank'
        //                         }
        //                     },
        //                     'iview-admin2.0文档'
        //                 ),
        //                 '快速查看'
        //             ]
        //         );
        //     }
        // });
        const fnGetRouters = (curRoutersOld, curRoutesNew) => {
            for (let i = curRoutersOld.length - 1; i >= 0; i--) {
                const route = curRoutersOld[i],
                    path = route.path;
                const myRoute = curRoutesNew.find(p => p.path === path);

                if (myRoute) {
                    // route.name = myRoute.name
                    route.redirect = myRoute.redirect;
                    route.meta.title = myRoute.label;
                    route.meta.icon = myRoute.icon;
                    fnGetRouters(route.children || [], myRoute.children || []);
                } else if (!route.isFix) {
                    curRoutersOld.splice(i, 1);
                }
            }
        };

        fnGetRouters(routers, myRoutes);
        this.$store.state.menuList = getMenuByRouter(
            routers,
            this.$root.$store.state.user.access
        );
        this.isShowMenu = true;
    }
};
</script>
