<template>
    <section class="menu-edit">
        <Card dis-hover>
            <p slot="title">
                <Icon type="md-create"></Icon>
                {{formTitle}}
            </p>
            <Form ref="data4Form" :model="data4Form" :rules="ruleValidate" :label-width="200">
                <FormItem label="父节点">
                    <Input v-model="parentName" placeholder="父节点" disabled></Input>
                </FormItem>
                <FormItem label="菜单名" prop="name">
                    <Input v-model="data4Form.name" placeholder="请输入菜单名"></Input>
                </FormItem>
                <FormItem label="图标" prop="icon" v-if="data4Form.type==='0'">
                    <Input v-model="data4Form.icon" placeholder="请选择图标" @click.native="iconSelectorVisible=true" readonly>
                    <Button slot="append" icon="md-apps"></Button>
                    </Input>
                </FormItem>
                <FormItem label="链接地址" prop="path" v-if="data4Form.type==='0'">
                    <Input v-model="data4Form.path" placeholder="请输入链接地址"></Input>
                </FormItem>
                <FormItem label="类型">
                    <Radios v-model="data4Form.type" :radios="types" label="value"></Radios>
                </FormItem>
                <FormItem label="权限标识" prop="permission">
                    <Input v-model="data4Form.permission" placeholder="请输入权限标识"></Input>
                </FormItem>
                <FormItem label="排序" prop="sort">
                    <Slider v-model="data4Form.sort" show-input></Slider>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('data4Form')">提交</Button>
                </FormItem>
            </Form>
        </Card>
        <IconSelector :visible.sync="iconSelectorVisible" @ok="iconChange" />
    </section>
</template>

<script>
import { $http } from '@/services/http';
import IconSelector from '@/view/comm/IconSelector';
import Radios from '@/view/comm/Radios';
export default {
    'name': 'menuEdit', // 公用组件单词首字母大写，业务组件驼峰命名
    'props': [],
    data () {
        const _require = { 'required': true, 'message': '必填', 'trigger': 'blur' };
        // const _requireNum = { required: true, message: '必填', trigger: 'blur', type: 'number' }
        const _requireWhenChange = { 'required': true, 'message': '必填', 'trigger': 'change' };

        return {
            'editMode': false,
            'formTitle': '新增',
            'data4Form': {},
            'parentName': '',
            'ruleValidate': {
                'name': [_require],
                'icon': [_requireWhenChange],
                'path': [_require]
                // permission: [_require],
            },
            'canAddMenu': true,
            'iconSelectorVisible': false
        };
    },
    'computed': {
        'types': function () {
            const result = [
                { 'name': '菜单', 'value': '0', 'disabled': !this.canAddMenu },
                { 'name': '按钮', 'value': '1' }
            ];

            return result;
        }
    },
    'methods': {
        setData4Form (id) {
            if (id !== 'undefined') {
                this.editMode = true;
                $http.get('v1/baseMenu/' + id).then(data => {
                    this.data4Form = data;
                    this.formTitle = `编辑 - [${this.data4Form.name}]`;
                    this.data4Form.icon = this.data4Form.icon || 'bookmark';
                    this.data4Form.sort = this.data4Form.sort || 0;
                });
            } else {
                this.editMode = false;
                this.data4Form = {
                    'parentId': this.$route.params.parentId || 0,
                    'type': '0'
                };
                this.formTitle = '新增';
            }
        },
        setParentName (id) {
            this.canAddMenu = true;
            this.data4Form.type = '0';
            if (id && id !== '0') {
                $http.get('v1/baseMenu/' + id).then(data => {
                    this.parentName = data.name;
                    if (data.type !== '0') {
                        this.canAddMenu = false;
                        this.data4Form.type = '1';
                    }
                });
            } else {
                this.parentName = '根节点';
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                const requestUrl = this.editMode ? 'v1/baseMenu/update' : 'v1/baseMenu/save';

                if (valid) {
                    $http.postObj(requestUrl, this.data4Form).then(data => {
                        if (typeof data === 'object') {
                            this.$router.push({
                                'name': 'menu-edit',
                                'params': { 'id': data.uid, 'parentId': data.parentId }
                            });
                        }
                        this.$parent.$parent.getData();
                        this.$Message.success('保存成功');
                    });
                }
            });
        },
        iconChange (icon) {
            this.data4Form.icon = icon;
        }
    },
    'components': { IconSelector, Radios },
    'filters': {},
    'watch': {
        '$route.params.id': {
            'handler': function (val) {
                val && this.setData4Form(val);
            },
            'immediate': true
        },
        '$route.params.parentId': {
            'handler': function (val) {
                val && this.setParentName(val);
            },
            'immediate': true
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.$refs['data4Form'].resetFields();
        next();
    },
    mounted () { }
};
</script>

<style lang="less">
</style>
