<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- test-书籍(单表)22编辑 -->
            <span>{{$i('demo-test_zdy_book2')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="testZdyBook2" :rules="rules" ref="testZdyBook2" >
            <!-- 书籍code -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookCode')" prop="bookCode">
                <el-input v-model="testZdyBook2.bookCode" auto-complete='off' v-if='!editState'></el-input>
                <span v-else>{{testZdyBook2.bookCode}}</span>
            </el-form-item>
            <!-- 书籍名称 -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookName')" prop="bookName">
                <el-input v-model="testZdyBook2.bookName"></el-input>
            </el-form-item>
            <!-- 作者 -->
            <el-form-item :label="$i('demo-test_zdy_book2-author')" prop="author">
                <el-input v-model="testZdyBook2.author"></el-input>
            </el-form-item>
            <!-- 作者简介 -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorInfo')" prop="authorInfo">
                <el-input type="textarea" v-model="testZdyBook2.authorInfo"></el-input>
            </el-form-item>
            <!-- 出版社 -->
            <el-form-item :label="$i('demo-test_zdy_book2-outUnitDict')">
                <el-select v-model="testZdyBook2.outUnitDict" clearable :placeholder="$i('cooco_public_select_placeholder')">
                    <el-option
                            v-for="item in outUnitDict"
                            :key="item.uid"
                            :label="$i(item.categoryCode + '-' + item.itemCode)"
                            :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 图书类型 -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookTypeDict')" prop="bookTypeDict">
                <el-checkbox-group v-model="testZdyBook2.bookTypeDict" size="small">
                    <el-checkbox
                            v-for="item in bookTypeDict"
                            :label="item.itemCode"
                            :key="item.itemCode">{{$i(item.categoryCode + '-' + item.itemCode)}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- logo -->
            <el-form-item :label="$i('demo-test_zdy_book2-logo_image')" prop='logoImage'>
                <upload :datasource="testZdyBook2.logoImage" keyName="'logoImage'" :listtype="'picture'" @success="handleLogoImage" :imgalone="1"></upload>
                <el-input v-model='testZdyBook2.logoImage' type="hidden"></el-input>
            </el-form-item>
            <!-- 作者电话 -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorPhone')" prop="authorPhone">
                <el-input v-model="testZdyBook2.authorPhone"></el-input>
            </el-form-item>
            <!-- 作者email -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorEmail')" prop="authorEmail">
                <el-input v-model="testZdyBook2.authorEmail"></el-input>
            </el-form-item>
            <!-- 作者个人url -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorUrl')" prop="authorUrl">
                <el-input v-model="testZdyBook2.authorUrl"></el-input>
            </el-form-item>
            <!-- 最后校验时间 -->
            <el-form-item :label="$i('demo-test_zdy_book2-checkTime')" prop="checkTime">
                <el-date-picker v-model="testZdyBook2.checkTime" type="datetime" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <!-- 出版日期 -->
            <el-form-item :label="$i('demo-test_zdy_book2-outDate')" prop="outDate">
                <el-date-picker v-model="testZdyBook2.outDate" type="date" :placeholder="$i('cooco_public_datepicker_placeholder')" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <!-- 版次 -->
            <el-form-item :label="$i('demo-test_zdy_book2-publishVer')" prop="publishVer">
                <el-input v-model="testZdyBook2.publishVer"></el-input>
            </el-form-item>
            <!-- 市场指导价 -->
            <el-form-item :label="$i('demo-test_zdy_book2-price')" prop="price">
                <el-input v-model="testZdyBook2.price"></el-input>
            </el-form-item>
            <!-- 是否召开发布会 -->
            <el-form-item :label="$i('demo-test_zdy_book2-isFbh')" prop="isFbh">
                <el-switch v-model="testZdyBook2.isFbh" :active-color="color.onColor" :inactive-color="color.offColor" :active-text="$i('cooco_public_switch_yes')" :inactive-text="$i('cooco_public_switch_no')">
                </el-switch>
            </el-form-item>
            <!-- 图书介绍 -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookInfo')" prop="bookInfo">
                <Ueditor :defaultMsg="testZdyBook2.bookInfo" ref="bookInfo" :id="'bookInfo'"></Ueditor>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 取消按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</el-button>
            <!-- 保存按钮 -->
            <el-button type="primary" class="wid-btn" @click="submit('testZdyBook2')" v-if="permissControl('test:zdy:book2:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { TestZdyBook2Model } from '../model/TestZdyBook2Model'
    import { $IMGSERVER } from '@/frame/utils/http'
    import Upload from '@/frame/components/Upload'
    import * as $validator from '@/frame/utils/validator'
    import { get, post, fillDict, color } from '@/frame/utils/common'
    import Ueditor from '@/frame/components/Ueditor'
    export default {
        data() {
            // 判断书籍code是否重复
            const testBookCode = (rule, value, callback) => {
                post('demo/book2/checkExistedByBookCode?bookCode=' + value, null, (data) => {
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
                store: this.$store.state.TestZdyBook2,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                outUnitDict: [],
                bookTypeDict: [],

                testZdyBook2: this.initFilter(new TestZdyBook2Model()),
                rules: {

                    bookCode: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 书籍code已被占用
                        validator: testBookCode,
                        message: this.$i('demo-test_zdy_book2-bookCode') + this.$i('cooco_public_rules_occupied'),
                        trigger: 'blur'
                    },
                    {   // 长度超出范围，最多允许字符数32
                        max: 32,
                        message: this.$i('cooco_public_rules_maxlength') + '32',
                        trigger: 'blur'
                    }],
                    bookName: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数128
                        max: 128,
                        message: this.$i('cooco_public_rules_maxlength') + '128',
                        trigger: 'blur'
                    }],
                    author: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数32
                        max: 32,
                        message: this.$i('cooco_public_rules_maxlength') + '32',
                        trigger: 'blur'
                    }],
                    authorInfo: [
                    {   // 长度超出范围，最多允许字符数512
                        max: 512,
                        message: this.$i('cooco_public_rules_maxlength') + '512',
                        trigger: 'blur'
                    }],
                    outUnitDict: [
                    {   // 不能为空
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    }],
                    bookTypeDict: [
                    {   // 不能为空
                        type: 'array',
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    {   // 长度超出范围，最多允许字符数32
                        type: 'array',
                        max: 32,
                        message: this.$i('cooco_public_rules_maxlength') + '32',
                        trigger: 'blur'
                    }],
                    logoImage: [
                    {   // 长度超出范围，最多允许字符数64
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                    authorPhone: [
                    {   // 手机格式不正确
                        validator: $validator.testPhone,
                        message: this.$i('cooco_public_rules_phone')
                    },
                    {   // 长度超出范围，最多允许字符数18
                        max: 18,
                        message: this.$i('cooco_public_rules_maxlength') + '18',
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
                    authorUrl: [
                    {   // 请正确填写URL格式
                        type: 'url',
                        message: this.$i('cooco_public_rules_url')
                    },
                    {   // 长度超出范围，最多允许字符数64
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                    checkTime: [
                    {   // 不能为空
                        type: 'string',
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    }],
                    outDate: [
                    {   // 不能为空
                        type: 'string',
                        trigger: 'blur',
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    }],
                    publishVer: [
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
                    price: [
                    {   // 必须为数字值（整数或小数）
                        validator: $validator.testFloat,
                        message: this.$i('cooco_public_rules_float')
                    }],
                    bookInfo: [
                    {   // 长度超出范围，最多允许字符数16777215
                        max: 16777215,
                        message: this.$i('cooco_public_rules_maxlength') + '16777215',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            submit(formName) {
                this.refs[formName].validate((valid) => {
                    if (valid) {
                        const data = this.sendFilter(this.testZdyBook2)
                        post('demo/book2/saveOrUpdate', data, () => {
                            this.router.push({ name: 'testZdyBook2' })
                        })
                    } else {
                        return false
                    }
                })
            },
            getData() {
                get('demo/book2/get', { uid: this.store.uid }, (data) => {
                    this.testZdyBook2 = this.initFilter(data.data)
                    fillDict('demo-test_zdy_book2-outUnitDict', this.outUnitDict, this.testZdyBook2, 'outUnitDict', false)
                    fillDict('test_tslx', this.bookTypeDict)
                })
            },
            resetData(formName) {
                var refs = this.$refs
                refs[formName].resetFields()
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'testZdyBook2' })
            },
            sendFilter(data) {
                data['bookTypeDict'] = data['bookTypeDict'].join(',') || ''
                // 布尔值转为数字
                data['isFbh'] = data['isFbh'] >>> 0
                data['bookInfo'] = this.refs.bookInfo.getUEContent()
                return data
            },
            handleLogoImage(res) {
                // 图片处理
                this.testZdyBook2.logoImage = res['list']
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
                result['bookTypeDict'] = result['bookTypeDict'] ? result['bookTypeDict'].split(',') : []
                // 布尔值转为数字
                result['isFbh'] = !!result['isFbh']
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
                fillDict('demo-test_zdy_book2-outUnitDict', this.outUnitDict, this.testZdyBook2, 'outUnitDict', true)
                fillDict('test_tslx', this.bookTypeDict)
            } else {
                this.store.keepSearchCondition = true
                delete this.rules.bookCode
                this.getData()
            }
        },
        components: {
            Upload,
            Ueditor
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

