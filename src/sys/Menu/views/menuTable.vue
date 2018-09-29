<template>
    <section class="formEdit">
        <el-form :model="formData" ref="formData" :rules="rules" label-width="16%">
            <!-- 菜单名称 -->
            <el-form-item :label="$i('sysbase-sys_menu-name')" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <!-- 国际化名称(繁体)-->
            <el-form-item :label="$i('sysbase-sys_menu-i18nname')">
                <el-input v-model="formData.zhTwName"></el-input>
            </el-form-item>
            <!-- 国际化名称(英文)-->
            <el-form-item :label="$i('sysbase-sys_menu-i18nengname')">
                <el-input v-model="formData.enUsName"></el-input>
            </el-form-item>
            <!-- 上级菜单-->
            <el-form-item v-show="!editState" :label="$i('sysbase-sys_premenu-name')">
                <template>{{ formData.parentName }}
                </template>
            </el-form-item>
            <!-- 类型   0：目录   1：菜单-->
            <el-form-item v-show="!editState" prop="type" :label="$i('sysbase-sys_menu-type')">
                <el-radio class="radio" v-model="formData.type" label="0">{{$i('sysbase-sys_menu-directories')}}</el-radio>
                <el-radio class="radio" v-model="formData.type" label="1">{{$i('sysbase-sys_menu-menu')}}</el-radio>
            </el-form-item>
            <!-- 路由(url)-->
            <el-form-item :label="$i('sysbase-sys_menu-url')">
                <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <!-- 图标-->
            <el-form-item :label="$i('sysbase-sys_menu-icon')">
                <el-input v-model="formData.icon"></el-input>
                <el-button type="primary" @click="openIconDialog"><i class="el-icon-setting"></i>{{$i('sysbase-sys_menu-select')}}</el-button>
                <span style="color:#999;margin-left:50px">{{$i('sysbase-sys_menu-icondetails')}}</span>
                <a style="color:#177bbb" href="https://material.io/icons" target="_blank">https://material.io/icons</a>
            </el-form-item>
            <!--排序-->
            <el-form-item :label="$i('sysbase-sys_menu-order_num')" prop="orderNum">
                <el-input v-model.number="formData.orderNum"></el-input>
            </el-form-item>
            <!--是否隐藏-->
            <el-form-item :label="$i('sysbase-sys_menu-isHidden')">
                <el-checkbox v-model="formData.isHidden" :true-label="1" :false-label="0">{{$i('sysbase-sys_menu-hidden')}}</el-checkbox>
            </el-form-item>
            <el-form-item :label="$i('sysbase-sys_menu-permission')"  v-if="formData.type==1">
                <el-button class="click-ripple" size="small" type="primary" :disabled="!editState && permisButton" @click.native="createPerm">{{$i("sysbase-sys_menu-addper")}}</el-button>
            </el-form-item>
            <el-form-item v-if="formData.type==1" :label="$i('sysbase-sys_menu-authoritylist')">
                <el-table :data="formData.childList" style="width: 100%" header-align="center">
                    <el-table-column prop="name" :label="$i('sysbase-sys_menu-authorityname')" width="180">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.name" :placeholder="$i('sysbase-sys_menu-newauthority')">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="perms" :label="$i('sysbase-sys_menu-authoritycode')" width="200" header-align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.perms" :placeholder="$i('sysbase-sys_menu-newname')">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNum" :label="$i('sysbase-sys_menu-order_num')" width="100" header-align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.orderNum" :placeholder="$i('sysbase-sys_menu-number')">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$i('cooco_public_table_handle')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-delete" @click="deleteData(scope.row.menuId, scope.$index)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <!--图标-->
            <el-dialog :title="$i('sysbase-sys_menu-icon')" :visible.sync="iconDialog">
                <div class="dialog-icon-box">
                    <div v-for="iconList in iconData" :key="iconList.data.name">
                        <p>{{iconList.data.name}}</p>
                        <i class="material-icons modal-icons" v-for="icon in iconList.data.child" @click="chooseIcon(icon.ligature)" :key="icon.ligature">{{icon.ligature}}</i>
                    </div>
                </div>
            </el-dialog>

            <el-form-item class="footer">
                <el-button class="click-ripple" type="primary" @click="saveData"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import { $get } from '@/frame/utils/http'
import { menuTableModel } from '@/sys/Menu/model/menuTableModel'
import { color, submitData } from '@/frame/utils/common'
import icon from '@/frame/assets/images/icon.json'

export default {
    watch: {
        $route() {
            this.renderForm()
        }
    },
    computed: {
        permisButton() {
            return !(this.formData.type >>> 0)
        }
    },
    mounted() {
        this.renderForm()
    },
    data() {
        return {
            _route: {},
            formData: Object.assign({}, menuTableModel),
            color: color,
            editState: true,
            iconDialog: false,
            rules: {
                name: [{ // 菜单名称不能为空
                    required: true,
                    message: this.$i('sysbase-sys_menu-name') + this.$i('cooco_public_rules_notNull'),
                    trigger: 'blur'
                }],
                orderNum: [{ // 序号不能为空
                    required: true,
                    message: this.$i('sysbase-sys_menu-order_num') + this.$i('cooco_public_rules_notNull')
                },
                { // 请输入整数 不能为空
                    type: 'number',
                    message: this.$i('cooco_public_rules_number')
                }
                ],
                type: [{
                    required: true,
                    message: this.$i('cooco_public_rules_notNull')
                }]
            },
            iconData: icon
        }
    },
    methods: {
        renderForm() {
            this._route = this.$route.params
            /**
             * 添加子节点： menuId非空，name非空
             * 添加根节点：menuId为否，name为否
             * 修改子节点： menuId非空，name为否
             */
            const pid = this._route.menuId
            const pname = this._route.name
            // 快速失败
            if (!pid && !pname) {
                // 新增根节点
                this.editState = false
                this.formData = this.initFilter(menuTableModel)
            } else if (pid && pname) {
                // 新增子节点
                this.editState = false
                this.formData = this.initFilter(menuTableModel)
            } else {
                // 修改子节点
                this.editState = true
                this.getTableData()
            }
            this.resetForm()
        },
        getTableData() {
            $get('sys/menu/info/' + this._route.menuId)
                .then((res) => {
                    if (res.data.code === 0) {
                        // 需要改为异步调用
                        this.formData = this.initFilter(res.data.menu)
                        // console.log(this.formData)
                        // 开始渲染页面
                        // // console.log(res.data.menu)
                    }
                })
        },
        initFilter(obj) {
            const data = Object.assign({}, obj)
            if (data.delChildIds == null) {
                data.delChildIds = []
            }
            const pid = this._route.menuId
            const pname = this._route.name
            if (!pid && !pname) {
                // 新增根节点
                data.parentId = 0
                data.parentName = '根路径'
            } else if (pid && pname) {
                // 新增子节点
                data.parentId = pid
                data.parentName = pname
            } else {
                // 修改子节点
            }
            // // console.log(data)
            // 解析国际化值
            if (data.i18nName) {
                const i18nObj = JSON.parse(data.i18nName)
                data.zhCnName = i18nObj['zh-CN']
                data.zhTwName = i18nObj['zh-TW']
                data.enUsName = i18nObj['en']
            }
            return data
        },
        sendFilter(obj) {
            const data = Object.assign({}, obj)
            data.isHidden = data.isHidden >>> 0
            // console.log(data)
            // 解析国际化值
            data.zhCn = data.name
            data.i18nName = '{"zh-CN":"' + data.zhCn + '","zh-TW":"' + data.zhTwName + '","en":"' + data.enUsName + '"}'
            data.i18nName = data.i18nName.replace('undefined', '')
            return data
        },
        saveData() {
            console.log(this.router)
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    if (this.editState) {
                        const params = {
                            url: 'sys/menu/update',
                            data: this.sendFilter(this.formData),
                            scope: this,
                            callback: () => { this.$parent.getTreeData() }
                        }
                        submitData(params)
                    } else {
                        const params = {
                            url: 'sys/menu/save',
                            data: this.sendFilter(this.formData),
                            scope: this,
                            callback: () => { this.$parent.getTreeData() }
                        }
                        submitData(params)
                        this.$router.push({ name: 'menu' })
                        // 新增之后，后台把数据返回给前台了，前台要回调下，否则新记录的menuId仍为null
                    }
                }
            })
        },
        createPerm() {
            const data = JSON.parse(JSON.stringify(menuTableModel))
            data.type = 2
            data.isHidden = 0
            this.formData.childList.push(data)
        },
        deleteData(menuId, index) {
            if (menuId) {
                this.formData.delChildIds.push(menuId)
            }
            this.formData.childList.splice(index, 1)
        },
        resetForm() {
            this.$refs['formData'].resetFields()
        },
        openIconDialog() {
            this.iconDialog = true
        },
        chooseIcon(icon) {
            this.formData.icon = icon
            this.iconDialog = false
        }
    }
}
</script>
<style lang="less" scoped>
.dialog-icon-box {
  > div {
    margin-bottom: 10px;
  }
}
.el-dialog {
  height: 80%;
  overflow-y: auto;
}
.formEdit {
  overflow: auto;
}
/* .footer {
    margin-left: 16%;
    padding-left: 25px;
    .wid-btn {
        width: 120px;
        span {
            width: 58px;
        }
    }
} */
</style>



