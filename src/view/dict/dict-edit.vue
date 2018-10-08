<template>
    <section class="dict-edit">
        <Card dis-hover>
            <p slot="title">
                <Icon type="md-create"></Icon>
                {{title}}
            </p>
            <Form ref="form" :model="data4Form" :rules="ruleValidate" :label-width="200">
                <div class="form-block">
                    <!--<p class="block-title">基本信息</p>-->
                    <FormItem label="数据值" prop="value">
                        <Input v-model="data4Form.value" placeholder="请输入数据值"></Input>
                    </FormItem>
                    <FormItem label="标签名" prop="label">
                        <Input v-model="data4Form.label" placeholder="请输入标签名"></Input>
                    </FormItem>
                    <FormItem label="类型" prop="type">
                        <Input v-model="data4Form.type" placeholder="请输入类型"></Input>
                    </FormItem>
                    <FormItem label="描述" prop="description">
                        <Input v-model="data4Form.description" placeholder="请输入描述"></Input>
                    </FormItem>
                    <FormItem label="排序" prop="sort">
                        <Slider v-model="data4Form.sort" show-input></Slider>
                    </FormItem>
                    <Row>
                        <Col :xs="24" :md="16" :lg="12">
                        <FormItem label="备注信息" prop="remarks">
                            <Input v-model="data4Form.remarks" type="textarea" :rows="2" placeholder="请输入备注信息"></Input>
                        </FormItem>
                        </Col>
                    </Row>

                </div>
            </Form>
            <footer>
                <Button icon="md-close" @click="close">取 消</Button>
                <Button type="primary" icon="md-checkmark" @click="ok" :disabled="$store.state.app.isLoading">提 交</Button>
            </footer>
        </Card>
    </section>
</template>

<script>
import { $http } from '@/services/http'

export default {
    name: 'dictEdit',
    data() {
        const _require = { required: true, message: '必填', trigger: 'blur' }
        const _requireNum = { required: true, message: '必填', trigger: 'blur', type: 'number' }
        return {
            title: '修改 - [ ]',
            editMode: false,
            data4Form: {},
            ruleValidate: {
                value: [_require],
                label: [_require],
                type: [_require],
                description: [_require],
                sort: [_requireNum]
            }
        }
    },
    methods: {
        getData(id) {
            if (id && id !== 'new') {
                this.editMode = true
                $http.get('v1/dict/' + id).then(data => {
                    this.data4Form = data
                    this.title = `修改 - [ ${this.data4Form.value} ]`
                })
            } else {
                this.editMode = false
                this.data4Form = {
                    sort: 0
                }
                this.title = '新增'
            }
        },
        handleSubmit(name) {
            return new Promise((resolve) => {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const requestUrl = this.editMode ? 'v1/dict/update' : 'v1/dict/add'
                        if (!this.$store.state.app.isLoading) {
                            this.$store.commit('setIsLoading', true);
                            $http.postObj(requestUrl, this.data4Form).then(data => {
                                this.$Message.success(this.editMode ? '修改成功' : '新增成功');
                                resolve()
                            })
                        }
                    }
                })
            })
        },
        ok() {
            this.handleSubmit('form').then(() => {
                this.close()
            })
        },
        close() {
            this.$router.go(-1)
        }
    },
    components: {},
    filters: {},
    watch: {},
    mounted() {
        this.getData(this.$route.params.id)
    }
}
</script>

<style lang="less">
//.dict-edit {}
</style>