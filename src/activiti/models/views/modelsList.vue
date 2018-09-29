<template>
    <section class="formList paper">
        <router-view></router-view>
        <span class="title">
          <!--流程列表-->
            <span>{{$i('act-act_re_model-list')}}</span>
        </span>
        <!-- <p class="batch-handle">
            <el-input v-model="store.modelName" placeholder="模型名称" @keyup.native.13="search"></el-input>
            <el-button class="click-ripple" type="primary" @click="search">
                <i class="el-icon-search"></i> 搜索</el-button>
            <el-button class="click-ripple" type="primary" @click="addData" v-if="permissControl('activiti_models:view')">
                <i class="el-icon-edit"></i> 新增</el-button>
        </p> -->
        <el-row type="flex" :gutter="20">
            <el-col :span="16">
              <!--模型名称-->
                <el-input v-model="store.postData.name" :placeholder="$i('act-act_re_model-model_name')" @keyup.native.13="search"></el-input>
              <!--搜索-->
                <el-button type="primary" @click="search"><i class="el-icon-search"></i> {{$i('cooco_public_button_search')}}</el-button>
            </el-col>
            <el-col class="cont-right" :span="4" :offset="4">
                <el-button type="primary" @click="addData" v-if="permissControl('activiti_models:view')"><i class="el-icon-edit"></i> {{$i('cooco_public_button_add')}}</el-button>
            </el-col>
        </el-row>
        <el-table :data="result.list"stripe border max-height="700" @selection-change="handleSelectionChange">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
          <!--模型KEY-->
            <el-table-column header-align="center" prop="modelKey" :label="$i('act-act_re_model-model_key')" show-overflow-tooltip></el-table-column>
          <!--模型名称-->
            <el-table-column header-align="center" prop="modelName" :label="$i('act-act_re_model-model_name')" show-overflow-tooltip></el-table-column>
          <!--元数据-->
            <el-table-column header-align="center" prop="modelMetaData" :label="$i('act-act_re_model-mate_info')" show-overflow-tooltip></el-table-column>
          <!--创建日期-->
            <el-table-column header-align="center" prop="modelCtime" :label="$i('act-act_re_model-create_date')" align="center"  show-overflow-tooltip></el-table-column>
          <!--最后更新时间-->
            <el-table-column header-align="center" prop="modelLMtime" :label="$i('act-act_re_model-model_name')" align="center" show-overflow-tooltip></el-table-column>
          <!--版本-->
            <el-table-column header-align="center" prop="modelVersion" :label="$i('act-act_re_model-model_version')" align="center" show-overflow-tooltip></el-table-column>
          <!--操作-->
            <el-table-column header-align="center" align="center" :label="$i('act-act_re_model-handle')" width="180px" fixed="right" v-if="permissControl('activiti_models:mgr')">
                <template slot-scope="scope">
                  <!--编辑-->
                    <i class="el-icon-edit" :title="$i('act-act_re_model-modify')" @click="editData(scope.row.modelId)"></i>
                  <!--部署-->
                    <i class="el-icon-star-on" :title="$i('act-act_re_model-deploy')"  @click="deployData(scope.row.modelId)"></i>
                  <!--删除-->
                    <i class="el-icon-delete" :title="$i('act-act_re_model-delete')"  @click="deleteData(scope.row.modelId)"></i>
                </template>
            </el-table-column>
        </el-table>

        <pagination :result.sync="result" :url="'activiti/model/getAllModels'" :param="store"></pagination>

    </section>
</template>
<script>
import Pagination from '@/frame/components/Pagination'
import { handleData, getData } from '@/frame/utils/common'
import { $postQs } from '@/frame/utils/http'

export default {
    computed: {
        // 多选删除，把选中行的uid存入数组
        deleteUidArray() {
            const arr = []
            this.multipleSelection.forEach((item) => {
                arr.push(item.uid)
            })
            return arr
        }
    },
    data() {
        return {
            // 表格数据
            result: {},
            multipleSelection: [],
            store: this.$store.state.activitiModels,
            router: this.$router
        }
    },
    methods: {
        // 获取列表数据
        getDataList() {
            const param = {
                data: this.store.postData,
                url: 'activiti/model/getAllModels'
            }
            const renderData = async () => {
                const data = await getData(param)
                this.result = data
            }
            renderData()
        },
        // 权限控制
        permissControl(string) {
            return this.$store.state.permissions.indexOf(string) !== -1
        },
        // 新增
        addData() {
            // 如果传null，vue-router会报错
            this.store.uid = ''
            this.store.keepSearchCondition = false
            this.router.push({ name: 'modelsEdit' })
        },
        // 编辑
        editData(uid) {
            this.store.modelId = uid
            this.store.keepSearchCondition = true
            $postQs('activiti/model/edit', this.store).then((resdata) => {
                this.$router.push({ name: 'models' })
                if (resdata.data.code === 0) {
                    window.location.href = window.location.href
                    window.open(resdata.data.data)
                }
            })
        },
        deployData(uid) {
           const param = {
                scope: this,
                url: 'activiti/model/deployModel',
                arr: {},
                callback: this.getDataList
            }
            param.arr = {'modelId': uid}
            handleData(param)
        },
        deleteData(uid) {
            const param = {
                scope: this,
                url: 'activiti/model/deleteModel',
                arr: [],
                callback: this.getDataList
            }
            // 单个删除
            param.arr = {'modelId': uid}
            handleData(param)
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 搜索
        search() {
            delete this.store.postData.page
            this.getDataList()
        },
        clearSearchCondition() {
            if (!this.store.keepSearchCondition) {
                this.store.modelName = ''
                this.store.postData = {}
            }
        }

    },
    mounted() {
        this.clearSearchCondition()
        this.getDataList()
    },
    components: {
        Pagination
    },
    filters: {
        statusFilter(value) {
            return value === 0 ? '' : '是'
        }
    }
}
</script>
