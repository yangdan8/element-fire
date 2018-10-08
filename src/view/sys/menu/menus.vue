<template>
    <section class="menus">
        <Card dis-hover>
            <p slot="title">
                <Icon type="md-list-box"></Icon>
                <!-- {{$store.state.app.activeMenu.title}} -->tuytuytuytu
            </p>
            <TreeView>
                <Button type="primary" long slot="header" @click="addNode(0)">新 增 根 节 点</Button>
                <Tree slot="tree" :data="data4Tree" :render="renderTreeContent"></Tree>
                <router-view slot="view"></router-view>
            </TreeView>
        </Card>
    </section>
</template>

<script>
import { Poptip } from 'iview';
import { $http } from '@/services/http';
import util from '@/libs/util';
import TreeView from '@/view/comm/TreeView';
export default {
    'name': 'menus', // 公用组件单词首字母大写，业务组件驼峰命名
    'props': [],
    data () {
        return {
            'data4Tree': [],
            'activeId': null
        };
    },
    'methods': {
        getData () {
            $http.get('v1/baseMenu/getTreeAll').then(data => {
                // 取出已展开节点id
                const expandIds = [];

                util.recurTreeData(this.data4Tree, node => (node.expand && expandIds.push(node.uid)));
                // 设置展开节点id
                util.recurTreeData(data, node => {
                    node.expand = false;
                    if (expandIds.includes(node.uid)) {
                        node.expand = true;
                    }
                });
                this.data4Tree = data;
            });
        },
        addNode (pid) {
            this.$router.push({
                'name': 'menu-edit',
                'params': { 'id': 'undefined', 'parentId': `${pid}` }
            });
        },
        editNode (node) {
            this.activeId = node.uid;
            this.$router.push({
                'name': 'menu-edit',
                'params': { 'id': `${node.uid}`, 'parentId': `${node.parentId}` }
            });
        },
        delNode (uid) {
            $http.post('v1/baseMenu/delete/' + uid).then(() => this.getData());
        },
        renderTreeContent (h, { root, node, data }) {
            let _title = null;
            let _addBtn = null;

            _title = <div class="tree-node-title" onClick={() => this.editNode(data)}>{data.title}</div>;

            if (data.type !== '1') {
                _addBtn = <span class="opt" onClick={() => this.addNode(data.uid)}><i class="ivu-icon ivu-icon-md-add" /></span>;
            }
            return (
                <div class={data.uid === this.activeId ? 'tree-node active' : 'tree-node'}>
                    {_title}
                    <div class="tree-options">
                        <span class="opt" onClick={() => this.editNode(data)}><i class="ivu-icon ivu-icon-md-create" /></span>
                        {_addBtn}
                        <Poptip class="opt" confirm transfer title="确定删除吗" on-on-ok={() => this.delNode(data.uid)}>
                            <span><i class="ivu-icon ivu-icon-md-trash" /></span>
                        </Poptip>
                    </div>
                </div >
            );
        }
    },
    'components': { TreeView, Poptip },
    'filters': {},
    'watch': {},
    mounted () {
    // this.getData()
    }
};
</script>
