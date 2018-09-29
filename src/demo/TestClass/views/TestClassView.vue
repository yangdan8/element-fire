<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- test-班级查看 -->
            <span>{{$i('demo-test_class')}}{{$i('cooco_public_panel_view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="testClass" ref="testClass" >
            <!-- 班级名称name -->
            <el-form-item :label="$i('demo-test_class-className')">
                <span>{{testClass.className}}</span>
            </el-form-item>
            <!-- 人数 -->
            <el-form-item :label="$i('demo-test_class-num')">
                <span>{{testClass.num}}</span>
            </el-form-item>
            <!-- 负责人电话 -->
            <el-form-item :label="$i('demo-test_class-authorPhone')">
                <span>{{testClass.authorPhone}}</span>
            </el-form-item>
            <!-- 负责人邮件 -->
            <el-form-item :label="$i('demo-test_class-authorEmail')">
                <span>{{testClass.authorEmail}}</span>
            </el-form-item>
            <!-- 班级图标 -->
            <el-form-item :label="$i('demo-test_class-logo_image')">
                <img v-if="testClass.logoImage" :src="'sys/fileUpload2db/getFile?fileId=' + testClass.logoImage" class="avatar" >
            </el-form-item>
            <!-- 出版社 -->
            <el-form-item :label="$i('demo-test_class-classGrade')">
                <span>{{testClass.classGrade}}</span>
            </el-form-item>
            <!-- 是否重点培训班级 -->
            <el-form-item :label="$i('demo-test_class-isImprove')">
                <span>{{testClass.isImprove}}</span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 关闭按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { TestClassModel } from '../model/TestClassModel'
    import { get } from '@/frame/utils/common'

    export default {
        data() {
            return {
                store: this.$store.state.TestClass,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                testClass: new TestClassModel()
            }
        },
        methods: {
            getData() {
                get('demo/class/get', { id: this.store.id }, (data) => {
                    this.testClass = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'testClass' })
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                data['isImprove'] = data['isImprove'] ? '是' : '否'
                return data
            }
        },
        mounted() {
            this.store.keepSearchCondition = true
            this.getData()
        }
    }
</script>
<style lang="less" scoped>
    .avatar {
        width: 178px;
        height: auto;
        display: block;
    }
</style>
