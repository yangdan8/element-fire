<template>
    <section class="formEdit paper">
        <span class="title">
            <!-- 系统磁盘附件查看 -->
            <span>{{$i('demo-sys_file_harddisk')}}{{$i('cooco_public_panel_view')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
        <el-form :model="sysFileHarddisk" ref="sysFileHarddisk" label-width="16%">
            <!-- 业务表id -->
            <el-form-item :label="$i('demo-sys_file_harddisk-businessId')">
                <span>{{sysFileHarddisk.businessId}}</span>
            </el-form-item>
            <!-- 业务表名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-bizTableName')">
                <span>{{sysFileHarddisk.bizTableName}}</span>
            </el-form-item>
            <!-- 处理后文件名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-fileName')">
                <span>{{sysFileHarddisk.fileName}}</span>
            </el-form-item>
            <!-- 原始文件名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-originalFileName')">
                <span>{{sysFileHarddisk.originalFileName}}</span>
            </el-form-item>
            <!-- 文件大小 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-fileSize')">
                <span>{{sysFileHarddisk.fileSize}}</span>
            </el-form-item>
            <!-- 文件扩展名 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-fileExtension')">
                <span>{{sysFileHarddisk.fileExtension}}</span>
            </el-form-item>
            <!-- 下载路径 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-downPath')">
                <span>{{sysFileHarddisk.downPath}}</span>
            </el-form-item>
            <!-- 上传时间 -->
            <el-form-item :label="$i('demo-sys_file_harddisk-uploadTime')">
                <span>{{sysFileHarddisk.uploadTime | datetimeFormat}}</span>
            </el-form-item>
        </el-form>
        <div class="footer">
            <!-- 关闭按钮 -->
            <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_close")}}</el-button>
        </div>
    </section>
</template>

<script>
    import { SysFileHarddiskModel } from '../model/SysFileHarddiskModel'
    import { get } from '@/frame/utils/common'
    import formatter from '@/frame/utils/dataFormat'

    export default {
        data() {
            return {
                store: this.$store.state.SysFileHarddisk,
                route: this.$route,
                router: this.$router,
                refs: this.$refs,
                sysFileHarddisk: new SysFileHarddiskModel()
            }
        },
        methods: {
            getData() {
                get('demo/harddisk/get', { uid: this.store.uid }, (data) => {
                    this.sysFileHarddisk = this.initFilter(data.data)
                })
            },
            closeWindow() {
                this.store.keepSearchCondition = true
                this.router.push({ name: 'sysFileHarddisk' })
            },
            initFilter(data) {
                if (!data) {
                    return null
                }
                return data
            }
        },
        filters: {
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
    .footer {
        margin-left: 16%;
        padding-left: 28px;
        .wid-btn {
            width: 120px;
            span {
                width: 58px;
            }
        }
    }
</style>
