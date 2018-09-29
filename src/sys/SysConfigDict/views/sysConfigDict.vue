<template>
    <section class="tree-table paper">
        <span class="title">
            <span>{{$i('sys-sys_configdict')}}</span>
        </span>
        <section class="tree-table-main">
            <div class="tree">
                <div class="add-root">
                    <el-button class="width-btn" type="primary" @click="addNode('0')" v-if="permissControl('sys_configdict:mgr')"><i class="el-icon-plus"></i>{{$i('cooco_public_tree_addrootnode')}}</el-button>
                </div>
                <div class="tree-list">
                    <el-tree :data="result" node-key="category" @node-click="handleNodeClick" :expand-on-click-node="false" :render-content="renderTree"></el-tree>
                </div>
            </div>
            <router-view></router-view>
            <el-dialog :title="$i('sys-sys_config')" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="handleClose">
                <el-form :model="sysConfigdict" :rules="rules"  ref="sysConfigdict" class="demo-form-inline">
                    <el-form-item :label="$i('sys-sys_configdict-category')" prop="category" :label-width="formLabelWidth">
                        <el-input v-model="sysConfigdict.category" auto-complete='off' v-if='!editState'></el-input>
                        <span v-else>{{sysConfigdict.category}}</span>
                    </el-form-item>
                    <el-form-item :label="$i('sys-sys_configdict-categoryName')" prop="categoryName" :label-width="formLabelWidth">
                        <el-input v-model="sysConfigdict.categoryName"></el-input>
                    </el-form-item>
                   <!--  <el-form-item :label="$i('sys-sys_configdict-parentId')" prop="parentId" :label-width="formLabelWidth">
                        <el-input v-model="sysConfigdict.parentId"></el-input>
                    </el-form-item> -->
                    <el-form-item :label="$i('sys-sys_configdict-orderNum')" prop="orderNum" :label-width="formLabelWidth">
                        <el-input v-model.number="sysConfigdict.orderNum"></el-input>
                    </el-form-item>
                    <el-form-item :label="$i('sys-sys_configdict-tempExplain')" prop="tempExplain" :label-width="formLabelWidth">
                        <el-input v-model="sysConfigdict.tempExplain" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="handleClose">{{$i("cooco_public_button_cancel")}}</el-button>
                    <el-button type="primary" @click="save" v-if="permissControl('sys_configdict:mgr')">{{$i("cooco_public_button_save")}}</el-button>
                </div>
            </el-dialog>
        </section>
    </section>
</template>

<script>
    import { SysConfigDictModel } from '@/sys/sysConfigDict/model/sysConfigDictModel'
    import { getData, toTree, post } from '@/frame/utils/common'

    export default {
        mounted() {
            this.getTreeData()
        },
        data() {
            return {
                formLabelWidth: '150px',
                router: this.$router,
                refs: this.$refs,
                store: this.$store.state.sysConfigDict,
                dialogVisible: false,
                sysConfigdict: {},
                // 是否编辑状态
                editState: false,
                // 验证规则
                rules: {

                    category: [
                    { // 不能为空
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    { // 长度超出范围，最多允许字符数100
                        max: 100,
                        message: this.$i('cooco_public_rules_maxlength') + '100',
                        trigger: 'blur'
                    }],
                    categoryName: [
                    { // 不能为空
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    { // 长度超出范围，最多允许字符数128
                        max: 128,
                        message: this.$i('cooco_public_rules_maxlength') + '128',
                        trigger: 'blur'
                    }],
                    parentId: [
                    { // 长度超出范围，最多允许字符数64
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                    orderNum: [
                    { // 请输入整数
                        type: 'number',
                        message: this.$i('cooco_public_rules_number')
                    }],
                    tempExplain: [
                    { // 长度超出范围，最多允许字符数256
                        max: 256,
                        message: this.$i('cooco_public_rules_maxlength') + '256',
                        trigger: 'blur'
                    }],
                    remark: [
                    { // 长度超出范围，最多允许字符数128
                        max: 128,
                        message: this.$i('cooco_public_rules_maxlength') + '128',
                        trigger: 'blur'
                    }]
                },
                result: [],
                // elementUI规范默认的树形菜单显示
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods: {
            handleClose() {
                this.dialogVisible = false
                this.refs['sysConfigdict'].resetFields()
            },
            // 获取左树数据
            getTreeData() {
                const param = {
                    data: {
                        excludeButton: 1,
                        limit: 1000
                    },
                    url: 'sys/configDict/list'
                }
                // 延迟请求
                const renderData = async () => {
                    const data = await getData(param)
                    this.result = this.initFilter(data.list)
                }
                renderData()
            },
            // 新增节点
            append(store, data, event) {
                // 阻止事件冒泡，防止点击后显示目录信息
                event.stopPropagation()
                this.addNode(data.uid)
            },
            // 修改节点
            modify(store, data, event) {
                // 阻止事件冒泡，防止点击后显示目录信息
                event.stopPropagation()
                this.dialogVisible = true
                this.editState = true
                Object.assign(this.sysConfigdict, data)
                delete this.rules.category
            },
            // 渲染树形菜单
            renderTree(h, { data, store }) {
                // 取type做判断，以便禁止菜单右侧添加按钮的权限
                const arg = arguments[1].data
                if (arg.type) {
                    return (
                            <div class='tree-handle'>
                                <span>{data.categoryName}</span>
                            </div>)
                } else {
                    return (
                            <div class='tree-handle'>
                                <span>{data.categoryName}</span>
                                <i on-click={(e) => this.append(store, data, e)} class='el-icon-plus'></i>
                                <i on-click={(e) => this.modify(store, data, e)} class='el-icon-edit'></i>
                            </div>)
                }
            },
            initFilter(data) {
                if (!data) {
                    return
                }
                // 将API传递过来的数据转为展示数据
                return toTree(data, 'uid', 'parentId', '0')
            },
            sendFilter(data) {
                return data
            },
            // 树形菜单点击事件
            handleNodeClick(data) {
                this.store.postData.categoryCode = data.category
                this.router.replace({ name: 'sysConfigDictItem' })
            },
            // 新增节点方法
            addNode(nodeid) {
                this.editState = false
                this.dialogVisible = true
                this.sysConfigdict = new SysConfigDictModel()
                this.sysConfigdict.parentId = nodeid
            },
            // 提交修改节点
            save() {
                this.refs['sysConfigdict'].validate((valid) => {
                    if (valid) {
                        this.updateData('sys/configDict/saveOrUpdate', this.sendFilter(this.sysConfigdict))
                    } else {
                        return false
                    }
                })
            },
            // 提交更新数据
            updateData(url, data) {
                post(url, data, () => {
                    this.editState = false
                    this.dialogVisible = false
                    this.getTreeData()
                })
            },
            // 权限控制
            permissControl(str) {
                return this.$store.state.permissions.indexOf(str) !== -1
            }
        }    
    }
</script>
<style lang="less">
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