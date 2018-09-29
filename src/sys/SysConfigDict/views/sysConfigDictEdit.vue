<template>
    <section class="formEdit paper">
        <span class="title">
            <span>{{$i('sys-sys_configdictitem')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="goback(true)"></i>
        </span>
        <el-form :model="sysConfigdictitem" ref="sysConfigdictitem" :rules="rules" label-width="16%">
            <el-form-item :label="$i('sys-sys_configdictitem-itemCode')" prop="itemCode">
                <el-input v-model="sysConfigdictitem.itemCode" auto-complete='off' v-if='!editState'></el-input>
                <span v-else>{{sysConfigdictitem.itemCode}}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-itemName')" prop="itemName">
                <el-input v-model="sysConfigdictitem.itemName"></el-input>
            </el-form-item>
            <!--国际化名称(繁体) -->
            <el-form-item :label="$i('sys-sys_configdictitem-i18nnametc')">
                <el-input v-model="sysConfigdictitem.zhTwName"></el-input>                
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-i18nnameen')">
                <el-input v-model="sysConfigdictitem.enUsName"></el-input>                
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-orderNum')" prop="orderNum">
                <el-input v-model.number="sysConfigdictitem.orderNum"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-isRemoved')">
                <el-switch v-model="sysConfigdictitem.isRemoved" :active-color='color.onColor' :inactive-color='color.offColor' active-text='是' inactive-text='否'>
                </el-switch>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-isDefault')">
                <el-switch v-model="sysConfigdictitem.isDefault" :active-color='color.onColor' :inactive-color='color.offColor' active-text='是' inactive-text='否'>
                </el-switch>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-tempremark')" :label-width="formLabelWidth">
                <span>{{ this.$store.state.sysConfigDict.explain }}</span>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-tempC1')" prop="tempC1">
                <el-input v-model="sysConfigdictitem.tempC1"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-tempC2')" prop="tempC2">
                <el-input v-model="sysConfigdictitem.tempC2"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-tempC3')" prop="tempC3">
                <el-input v-model="sysConfigdictitem.tempC3"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-tempC4')" prop="tempC4">
                <el-input v-model="sysConfigdictitem.tempC4"></el-input>
            </el-form-item>
            <el-form-item :label="$i('sys-sys_configdictitem-tempC5')" prop="tempC5">
                <el-input v-model="sysConfigdictitem.tempC5"></el-input>
            </el-form-item>
            <div class="footer">
                <button type="button" class="btn-cancel" @click="goback(true)"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}</button>
                <button type="button" class="btn-submit"  @click="save" v-if="permissControl('sys_configdict:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</button>
            </div>
        </el-form>
    </section>
</template>
<script>
import { SysConfigDictItemModel } from '@/sys/sysConfigDict/model/sysConfigDictModel'
import { submitData, get, color } from '@/frame/utils/common'

export default {
    data() {
        return {
            color: color,
            refs: this.$refs,
            route: this.$route,
            router: this.$router,
            formLabelWidth: '200px',
            editState: true,
            sysConfigdictitem: this.initFilter(new SysConfigDictItemModel()),
            store: this.$store.state.sysConfigDict,
            rules: {
                itemCode: [
                    { // 不能为空
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    { // 长度超出范围，最多允许32个字
                        max: 32,
                        message: this.$i('cooco_public_rules_maxlength') + '32',
                        trigger: 'blur'
                    }],
                itemName: [
                    { // 不能为空
                        required: true,
                        message: this.$i('cooco_public_rules_notNull')
                    },
                    { // 长度超出范围，最多允许64个字
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                orderNum: [
                    { // 请输入整数
                        type: 'number',
                        message: this.$i('cooco_public_rules_number')
                    }],
                tempC1: [
                    { // 长度超出范围，最多允许64个字
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                tempC2: [
                    {
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                tempC3: [
                    {
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                tempC4: [
                    {
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                tempC5: [
                    {
                        max: 64,
                        message: this.$i('cooco_public_rules_maxlength') + '64',
                        trigger: 'blur'
                    }],
                remark: [
                    {
                        max: 128,
                        message: this.$i('cooco_public_rules_maxlength') + '128',
                        trigger: 'blur'
                    }]
            }
        }
    },
    methods: {
        // 获取数据
        getData() {
            get('sys/configDictitem/get', { uid: this.store.uid }, (res) => {
                this.sysConfigdictitem = this.initFilter(res.data)
            })
        },
        // 保存修改
        save() {
            const params = {
                url: 'sys/configDictitem/saveOrUpdate',
                data: this.sendFilter(this.sysConfigdictitem),
                scope: this,
                callback: () => {
                    this.goback()
                }
            }
            this.refs['sysConfigdictitem'].validate((valid) => {
                if (valid) {
                    submitData(params)
                }
            })
        },
        // 返回上一级
        goback(keep) {
            if (keep) {
                this.store.keepSearchCondition = keep
            }
            this.router.push({ name: 'sysConfigDictItem' })
        },
        // 接收数据预处理
        initFilter(data) {
            if (!data) {
                return
            }
            // 数字转为布尔值数字
            data.isRemoved === 1 ? data.isRemoved = true : data.isRemoved = false
            // 数字转为布尔值数字
            data.isDefault === 1 ? data.isDefault = true : data.isDefault = false
            // 解析国际化值
            if (data.i18nName) {
                const i18nObj = JSON.parse(data.i18nName)
                data.zhCnName = i18nObj['zh-CN']
                data.zhTwName = i18nObj['zh-TW']
                data.enUsName = i18nObj['en']
            }
            return data
        },
        sendFilter(data) {
            data.categoryCode = this.store.postData.categoryCode
            // 布尔值转为数字
            data['isRemoved'] = data['isRemoved'] >>> 0
            // 布尔值转为数字
            data['isDefault'] = data['isDefault'] >>> 0
            if (data.uid === '') {
                data.uid = null
            }
            // 解析国际化值
            data.zhCn = data.itemName
            data.i18nName = '{"zh-CN":"' + data.zhCn + '","zh-TW":"' + data.zhTwName + '","en":"' + data.enUsName + '"}'
            data.i18nName = data.i18nName.replace('undefined', '')
            return data
        },
        // 权限控制
        permissControl(str) {
            return this.$store.state.permissions.indexOf(str) !== -1
        }
    },
    mounted() {
        // console.info(this.store)
        var type = this.route.params.type
        if (type === 'add') {
            this.editState = false
            this.store.keepSearchCondition = false
        } else {
            this.store.keepSearchCondition = true
            delete this.rules.itemCode
            this.getData()
        }
    }
}
</script>
<style lang="less" scoped>
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
