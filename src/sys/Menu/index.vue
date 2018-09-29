<template>
    <section class="tree-table paper">
        <span class="title">
            <span>{{$i('sysbase-sys_menu')}}</span>
        </span>
        <section class="tree-table-main">
        <div class="tree">
            <div class="add-root">
                    <el-button class="width-btn" type="primary" @click="createRootNode"><i class="el-icon-plus"></i>{{$i('sysbase-sys_menu-addnode')}}</el-button>
            </div>
            <div class="tree-list">
              <el-tree :data="treeData" :props="defaultProps" node-key="menuId" @node-click="handleNodeClick" :default-expand-all="false" :expand-on-click-node="true" :render-content="renderContent"></el-tree>
            </div>
        </div>
        <router-view></router-view>
        </section>
    </section>
</template>

<script>
import { getData, toTree } from '@/frame/utils/common'
import { menuTableModel } from '@/sys/Menu/model/menuTableModel'

export default {
    mounted() {
        this.getTreeData()
    },
    data() {
        return {
            id: 100,
            activeNode: [],
            treeData: [],
            apiData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    methods: {
        // 获取左树数据
        getTreeData() {
            const param = {
                data: {
                    excludeButton: 1,
                    limit: 1000
                },
                url: 'sys/menu/list',
                scope: this
            }
            const renderData = async () => {
                const data = await getData(param)
                this.apiData = data.list
                this.treeData = this.initFilter(data.list)
            }
            renderData()
        },
        renderContent(h, { node, data, store }) {
            // 取type做判断，以便禁止菜单右侧添加按钮的权限
            const arg = arguments[1].data
            if (arg.type) {
                return (
                    <div class='tree-handle'>
                        <span title={ node.label }>{node.label}</span>
                    </div>)
            } else {
                return (
                    <div class='tree-handle'>
                        <span title={ node.label }>{node.label}</span>
                        <i class='el-icon-plus' on-click={(e) => this.append(store, data, e)}></i>
                    </div>)
            }
        },
        initFilter(data) {
            // 将API传递过来的数据转为展示数据
            return toTree(data, 'menuId', 'parentId', 0)
        },
        createRootNode() {
            /**
             * 添加根节点
             * menuId：为否
             * name：为否
             */
            this.handleRouter({
                menuId: false,
                name: false
            })
        },
        append(store, data, event) {
            /**
             * 添加子节点
             * menuId：非空
             * name：非空
             */
            // 阻止事件冒泡，防止点击后显示目录信息
            event.stopPropagation()
            const obj = Object.assign({}, menuTableModel)
            obj.name = '新增菜单'
            obj.parentName = data.name
            // obj.parentName = store.parentName
            store.append(obj, data)
            this.handleRouter({
                menuId: data.menuId,
                name: data.name
            })
        },
        handleNodeClick(data) {
            /**
             * 修改子节点
             * menuId：非空
             * name：为否
             */
            if (data.menuId) {
                this.handleRouter({
                    menuId: data.menuId,
                    name: false
                })
            } else {
                // 点击了‘新增菜单’项
                this.handleRouter({
                    menuId: false,
                    name: data.parentName
                })
            }
        },
        handleRouter(data) {
            this.$router.replace({
                name: 'menuTable',
                params: {
                    menuId: data.menuId,
                    name: data.name
                }
            })
        }
    }
}
</script>
<style lang="less">
.tree-table {
  display: flex;
  flex: 1;
  .tree {
    height: 100%;
    flex-direction: column;
    .tree-list{
      width: 302px;
      border-top: 1px solid #d1dbe5;
      overflow-x: auto;
      .el-tree {
        min-width: 300px;
        display: inline-block;
        height: 100%;
        border: none;
      }
    }
  }
  .table {
    flex: 1;
    .filter-tree {
      height: 100%;
    }
  }
}

.el-tree-node__content {
  display: flex;
  align-items: center;
}

.tree-handle {
  width: 100%;
  display: flex;
  padding-right: 20px;
  justify-content: space-between;
  align-items: center;
  span{
      flex-grow: 1;
      margin: 0 15px 0 0;
  }
}

.tree-table-main {
    height: 100%;
    display: flex;
}
</style>
