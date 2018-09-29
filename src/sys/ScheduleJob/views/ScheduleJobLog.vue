<template>
  <section class="formList paper">
    <router-view></router-view>
    <span class="title">
            <!--<span>定时任务日志列表</span>-->
          <span>{{$i('sysbase-schedule_job_log')}}</span>
        </span>
    <el-row type="flex" :gutter="20">
      <el-col :span="16">
        <!--任务ID-->
        <el-input v-model="store.postData.jobId" :placeholder="$i('sysbase-schedule_job_log-job_id')" @keyup.native.13="search"></el-input>
        <!--搜索-->
        <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i('cooco_public_button_search')}} </el-button>
        <!--返回-->
        <el-button class="click-ripple" type="primary" @click="back"><i class="el-icon-back"></i>{{$i('cooco_public_button_back')}}</el-button>
      </el-col>
    </el-row>
    <el-table :data="result.list" stripe border height="600" @selection-change="handleSelectionChange">
      <!--行号-->
      <el-table-column header-align="center" align="left" fixed="left" type="index" :label="$i('sysbase-schedule_job_log-line_number')" width="70"
                       show-overflow-tooltip></el-table-column>
      <!--日志ID-->
      <el-table-column header-align="center" align="center" prop="logId" :label="$i('sysbase-schedule_job_log-log_id')"
                       show-overflow-tooltip></el-table-column>
      <el-table-column header-align="center" align="center" prop="jobId" :label="$i('sysbase-schedule_job_log-job_id')"
                       show-overflow-tooltip></el-table-column>
      <!--bean名称-->
      <el-table-column header-align="center" prop="beanName" :label="$i('sysbase-schedule_job_log-bean_name')" show-overflow-tooltip></el-table-column>
      <!--方法名称-->
      <el-table-column header-align="center" prop="methodName" :label="$i('sysbase-schedule_job_log-method_name')" show-overflow-tooltip></el-table-column>
      <!--参数-->
      <el-table-column header-align="center" prop="params" :label="$i('sysbase-schedule_job_log-params')" show-overflow-tooltip></el-table-column>
      <!--状态-->
      <el-table-column header-align="center" align="center" prop="status" :label="$i('sysbase-schedule_job_log-status')">
        <template slot-scope="scope">
          <span v-if="!scope.row.status" style="color:red">{{$i('cooco_public_tips_normal')}}</span>
          <span v-else>{{$i('cooco_public_tips_pause')}}</span>
        </template>
      </el-table-column>
      <!--耗时(单位：毫秒)-->
      <el-table-column header-align="center" align="center" prop="times" :label="$i('sysbase-schedule_job_log-times_consume')"
                       show-overflow-tooltip></el-table-column>
      <!--创建时间-->
      <el-table-column header-align="center" prop="createTime" :label="$i('sysbase-schedule_job_log-create_time')" show-overflow-tooltip></el-table-column>
    </el-table>

    <pagination :result.sync="result" :url="'sys/scheduleLog/list'" :param="store"></pagination>

  </section>
</template>
<script>
  import Pagination from '@/frame/components/Pagination'
  import formatter from '@/frame/utils/dataFormat'
  import {handleDelete, getData} from '@/frame/utils/common'

  export default {
    computed: {
      // 多选删除，把选中行的logId存入数组
      getDeleteArr() {
        const arr = []
        this.multipleSelection.forEach((item) => {
          arr.push(item.logId)
        })
        return arr
      }
    },
    data() {
      return {
        fm: formatter,
        result: {},
        store: this.$store.state.ScheduleJobLog,
        router: this.$router,
        multipleSelection: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      back() {
        this.router.push({name: 'scheduleList'})
      },
      deleteData(singleId) {
        const param = {
          url: 'sys/scheduleLog/deleteBatch',
          arr: this.getDeleteArr,
          id: singleId,
          callback: this.getDataList
        }
        handleDelete(param)
      },
      // 获取列表数据
      getDataList() {
        const param = {
          data: this.store.postData,
          url: 'sys/scheduleLog/list'
        }
        const renderData = async () => {
          const data = await getData(param)
          this.result = data
        }
        renderData()
      },
      // 搜索
      search() {
        delete this.store.postData.page
        this.getDataList()
      },
      // 权限控制
      permissControl(str) {
        return this.$store.state.permissions.indexOf(str) !== -1
      },
      // 新增
      addPage() {
        this.router.push({name: 'scheduleJobLogEdit', params: {type: 'add'}})
      },
      // 编辑
      editPage(id) {
        this.store.logId = id
        this.router.push({name: 'scheduleJobLogEdit'})
      },
      clearSearchCondition() {
        if (!this.store.keepSearchCondition) {
          this.store.postData = {}
        }
      },
      renderList() {
        this.getDataList()
      }

    },
    mounted() {
      this.clearSearchCondition()
      this.renderList()
    },
    components: {
      Pagination
    }
    // ,
    // filters: {
    //   statusFilter(value) {
    //     return value === 0 ? '正常' : '暂停'
    //   }
    // }
  }
</script>
