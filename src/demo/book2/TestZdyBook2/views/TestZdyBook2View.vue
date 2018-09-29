<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- test-书籍(单表)22查看 -->
            <span>{{$i('demo-test_zdy_book2')}}{{$i('cooco_public_panel_view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="testZdyBook2" ref="testZdyBook2" >
            <!-- 书籍code -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookCode')">
                <span>{{testZdyBook2.bookCode}}</span>
            </el-form-item>
            <!-- 书籍名称 -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookName')">
                <span>{{testZdyBook2.bookName}}</span>
            </el-form-item>
            <!-- 作者 -->
            <el-form-item :label="$i('demo-test_zdy_book2-author')">
                <span>{{testZdyBook2.author}}</span>
            </el-form-item>
            <!-- 作者简介 -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorInfo')">
                <span>{{testZdyBook2.authorInfo}}</span>
            </el-form-item>
            <!-- 出版社 -->
            <el-form-item :label="$i('demo-test_zdy_book2-outUnitDict')">
                <span>{{testZdyBook2.outUnitDict}}</span>
            </el-form-item>
            <!-- 图书类型 -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookTypeDict')">
                <span>{{testZdyBook2.bookTypeDict}}</span>
            </el-form-item>
            <!-- logo -->
            <el-form-item :label="$i('demo-test_zdy_book2-logo_image')">
                <img v-if="testZdyBook2.logoImage" :src="'sys/fileUpload2db/getFile?fileId=' + testZdyBook2.logoImage" class="avatar" >
            </el-form-item>
            <!-- 作者电话 -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorPhone')">
                <span>{{testZdyBook2.authorPhone}}</span>
            </el-form-item>
            <!-- 作者email -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorEmail')">
                <span>{{testZdyBook2.authorEmail}}</span>
            </el-form-item>
            <!-- 作者个人url -->
            <el-form-item :label="$i('demo-test_zdy_book2-authorUrl')">
                <span>{{testZdyBook2.authorUrl}}</span>
            </el-form-item>
            <!-- 最后校验时间 -->
            <el-form-item :label="$i('demo-test_zdy_book2-checkTime')">
                <span>{{testZdyBook2.checkTime | datetimeFormat}}</span>
            </el-form-item>
            <!-- 出版日期 -->
            <el-form-item :label="$i('demo-test_zdy_book2-outDate')">
                <span>{{testZdyBook2.outDate | dateFormat}}</span>
            </el-form-item>
            <!-- 版次 -->
            <el-form-item :label="$i('demo-test_zdy_book2-publishVer')">
                <span>{{testZdyBook2.publishVer}}</span>
            </el-form-item>
            <!-- 市场指导价 -->
            <el-form-item :label="$i('demo-test_zdy_book2-price')">
                <span>{{testZdyBook2.price}}</span>
            </el-form-item>
            <!-- 是否召开发布会 -->
            <el-form-item :label="$i('demo-test_zdy_book2-isFbh')">
                <span>{{testZdyBook2.isFbh}}</span>
            </el-form-item>
            <!-- 图书介绍 -->
            <el-form-item :label="$i('demo-test_zdy_book2-bookInfo')">
                <span v-html="testZdyBook2.bookInfo"></span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 关闭按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { TestZdyBook2Model } from '../model/TestZdyBook2Model'
    import { get, translateDict } from '@/frame/utils/common'
    import formatter from '@/frame/utils/dataFormat'

    export default {
        data() {
            return {
                store: this.$store.state.TestZdyBook2,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                testZdyBook2: new TestZdyBook2Model()
            }
        },
        methods: {
            getData() {
                get('demo/book2/get', { uid: this.store.uid }, (data) => {
                    this.testZdyBook2 = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'testZdyBook2' })
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                data['outUnitDict'] = translateDict('demo-test_zdy_book2-outUnitDict', data['outUnitDict'])
                data['bookTypeDict'] = translateDict('test_tslx', data['bookTypeDict'])
                data['isFbh'] = data['isFbh'] ? '是' : '否'
                return data
            }
        },
        filters: {
            dateFormat(value) {
                return formatter.date(null, null, value)
            },
            datetimeFormat(value) {
                return formatter.datetime(null, null, value)
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
