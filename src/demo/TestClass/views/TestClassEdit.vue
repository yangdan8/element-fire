<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- test-班级编辑 -->
            <span>{{$i('demo-test_class')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="testClass" :rules="rules" ref="testClass" >
            <!-- 班级名称name -->
            <el-form-item :label="$i('demo-test_class-className')" prop="className">
                <el-input v-model="testClass.className" auto-complete='off' v-if='!editState'></el-input>
                <span v-else>{{testClass.className}}</span>
            </el-form-item>
            <!-- 人数 -->
            <el-form-item :label="$i('demo-test_class-num')" prop="num">
                <el-input v-model="testClass.num"></el-input>
            </el-form-item>
            <!-- 负责人电话 -->
            <el-form-item :label="$i('demo-test_class-authorPhone')" prop="authorPhone">
                <el-input v-model="testClass.authorPhone"></el-input>
            </el-form-item>
            <!-- 负责人邮件 -->
            <el-form-item :label="$i('demo-test_class-authorEmail')" prop="authorEmail">
                <el-input v-model="testClass.authorEmail"></el-input>
            </el-form-item>
            <!-- 班级图标 -->
            <el-form-item :label="$i('demo-test_class-logo_image')" prop='logoImage'>
                <upload :datasource="testClass.logoImage" keyName="'logoImage'" :listtype="'picture'" @success="handleLogoImage" :imgalone="1"></upload>
                <el-input v-model='testClass.logoImage' type="hidden"></el-input>
            </el-form-item>
            <!-- 出版社 -->
            <el-form-item :label="$i('demo-test_class-classGrade')" prop="classGrade">
                <el-input v-model="testClass.classGrade"></el-input>
            </el-form-item>
            <!-- 是否重点培训班级 -->
            <el-form-item :label="$i('demo-test_class-isImprove')" prop="isImprove">
                <el-switch v-model="testClass.isImprove" :active-color="color.onColor" :inactive-color="color.offColor" :active-text="$i('cooco_public_switch_yes')" :inactive-text="$i('cooco_public_switch_no')">
                </el-switch>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 取消按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <!-- 保存按钮 -->
            <el-button type="primary" class="wid-btn" @click="submit('testClass')" v-if="permissControl('test:class:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { TestClassModel } from '../model/TestClassModel'
    import { $IMGSERVER } from '@/frame/utils/http'
    import Upload from '@/frame/components/Upload'
    import * as $validator from '@/frame/utils/validator'
    import { get, post, color } from '@/frame/utils/common'

    export default {
        data() {
            // 判断班级名称name是否重复
            const testClassName = (rule, value, callback) => {
                post('demo/class/checkExistedByClassName?className=' + value, null, (data) => {
                    data.isExisted ? callback(new Error('')) : callback()
                    return true
                }, () => {
                    callback(new Error())
                })
            }
            return {
                IMGSERVER: $IMGSERVER,
                color: color,
                editState: true,
                store: this.$store.state.TestClass,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,

                testClass: this.initFilter(new TestClassModel()),
                rules: {

                    className: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 班级名称name已被占用
                        validator: testClassName,
                        message: this.$i('demo-test_class-className') + this.$i('cooco_public_rules_occupied'),
                        trigger: 'blur'
                    },
                    {   // 长度超出范围，最多允许字符数30
                        max: 30,
                        message: this.$i('cooco_public_rules_maxlength') + '30',
                        trigger: 'blur'
                    }],
                    num: [
                    {   // 不能为空
                        type: 'string',
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 请输入整数
                        validator: $validator.testNumber,
                        message: this.$i('cooco_public_rules_number')
                    }],
                    authorPhone: [
                    {   // 手机格式不正确
                        validator: $validator.testPhone,
                        message: this.$i('cooco_public_rules_phone')
                    },
                    {   // 长度超出范围，最多允许字符数11
                        max: 11,
                        message: this.$i('cooco_public_rules_maxlength') + '11',
                        trigger: 'blur'
                    }],
                    authorEmail: [
                    {   // 邮箱格式不正确
                        type: 'email',
                        message: this.$i('cooco_public_rules_email')
                    },
                    {   // 长度超出范围，最多允许字符数64
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                    logoImage: [
                    {   // 长度超出范围，最多允许字符数64
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                    classGrade: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数64
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submit(formName) {
                this.refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.testClass)
                        post('demo/class/saveOrUpdate', data, () => {
                            this.router.push({ name: 'testClass' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('demo/class/get', { id: this.store.id }, (data) => {
                    this.testClass = this.initFilter(data.data)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'testClass' })
            },
            sendFilter(data) {
                // 布尔值转为数字
                data['isImprove'] = data['isImprove'] >>> 0
                return data
            },
            handleLogoImage(res) {
                // 图片处理
                this.testClass.logoImage = res['list']
            },
            beforeLogoImage(file) {
                // 图片处理
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 2
                if (!isJPG) {
                    const message = this.$i('cooco_public_uploadimage_error_jpg_format')
                    this.$message.error(message)
                }
                if (!isLt2M) {
                    const message = this.$i('cooco_public_uploadimage_error_range')
                    this.$message.error(message)
                }
                return isJPG && isLt2M
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                var result = {}
                Object.assign(result, data)
                // 布尔值转为数字
                result['isImprove'] = !!result['isImprove']
                return result
            },
            // 权限控制
            permissControl(str) {
                return this.$store.state.permissions.indexOf(str) !== -1
            }
        },
        mounted() {
            var type = this.route.params.type
            if (type === 'add') {
                this.editState = false
                this.store.keepSearchCondition = false
            } else {
                this.store.keepSearchCondition = true
                delete this.rules.className
                this.getData()
            }
        },
        components: {
            Upload
        }
    }
</script>
<style lang="less" scoped>
    .avatar-uploader {
        display: flex;
        align-items: center;
    }
    .avatar-uploader .el-upload {
        //   border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

