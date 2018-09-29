<template>
  <section class="formList paper">
    <router-view></router-view>
    <span class="title">
            <!-- 定时任务列表 -->
            <span>{{$i('sysbase-schedule_job')}}</span>
        </span>
    <el-row type="flex" :gutter="20">
      <el-col :span="16">
        <!-- spring bean名称 -->
        <el-input v-model="store.postData.beanName" :placeholder="$i('sysbase-schedule_job-bean_name')"
                  @keyup.native.13="search"></el-input>
        <!-- 搜索按钮 -->
        <el-button type="primary" @click="search"><i class="el-icon-search"></i>{{$i("cooco_public_button_search")}}
        </el-button>
      </el-col>
      <el-col class="cont-right" :span="4" :offset="4">
        <!-- 新增按钮 -->
        <el-button type="primary" @click="addPage" v-if="permissControl('sys:schedule:mgr')"><i
          class="el-icon-edit"></i>{{$i("cooco_public_button_add")}}
        </el-button>
        <!--暂停按钮-->
        <el-button class="click-ripple" type="primary" @click="confirmPause(null)"
                   v-if="permissControl('sys:schedule:mgr')">
          <i class="el-icon-circle-close-outline"></i> {{$i("sysbase-schedule_job-pause")}}
        </el-button>
        <!--恢复按钮-->
        <el-button class="click-ripple" type="primary" @click="confirmResume(null)"
                   v-if="permissControl('sys:schedule:mgr')">
          <i class="el-icon-circle-check-outline"></i> {{$i("sysbase-schedule_job-resume")}}
        </el-button>
        <!--立即执行按钮-->
        <el-button class="click-ripple" type="primary" @click="confirmRun(null)"
                   v-if="permissControl('sys:schedule:mgr')">
          <i class="el-icon-d-arrow-right"></i> {{$i("sysbase-schedule_job-run_now")}}
        </el-button>
        <!--日志列表按钮-->
        <el-button class="click-ripple" type="info" @click="logList(null)" v-if="permissControl('sys:schedule:log')">
          {{$i("sysbase-schedule_job-log_list")}}
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="result.list" stripe border height="600" @selection-change="handleSelectionChange">
      <!--行号-->
      <el-table-column fixed="left" type="index" :label="$i('sysbase-schedule_job-line_num')"
                       width="70"></el-table-column>
      <el-table-column type="selection" header-align="center" align="center"></el-table-column>
      <!--任务ID-->
      <el-table-column header-align="center" prop="jobId" :label="$i('sysbase-schedule_job-job_id')"
                       show-overflow-tooltip></el-table-column>
      <!--bean名称-->
      <el-table-column header-align="center" prop="beanName" :label="$i('sysbase-schedule_job-bean_name')"
                       show-overflow-tooltip></el-table-column>
      <!-- 方法名 -->
      <el-table-column header-align="center" prop="methodName" :label="$i('sysbase-schedule_job-method_name')"
                       show-overflow-tooltip></el-table-column>
      <!--参数-->
      <el-table-column header-align="center" prop="params" :label="$i('sysbase-schedule_job-params')" width="180"
                       show-overflow-tooltip></el-table-column>
      <!-- cron表达式 -->
      <el-table-column header-align="center" prop="cronExpression" :label="$i('sysbase-schedule_job-cron_expression')"
                       show-overflow-tooltip></el-table-column>
      <!-- 备注 -->
      <el-table-column header-align="center" prop="remark" :label="$i('sysbase-schedule_job-remark')"
                       show-overflow-tooltip></el-table-column>
      <!--状态-->
      <el-table-column prop="status" :label="$i('sysbase-schedule_job-status')">
        <template slot-scope="scope">
          <!--暂停-->
          <span v-if="scope.row.status" style="color:red">{{ $i("cooco_public_tips_pause") }}</span>
          <!--正常-->
          <span v-if="!scope.row.status">{{ $i("cooco_public_tips_normal") }}</span>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column header-align="center" align="center" width="100px" :label="$i('sysbase-schedule_job-handle')"
                       v-if="permissControl('sys:schedule:mgr')" fixed="right">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="editPage(scope.row.jobId)"></i>
          <i class="el-icon-delete" @click="deleteData(scope.row.jobId)"></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination :result.sync="result" :url="'sys/schedule/list'" :param="store"></pagination>

  </section>
</template>
<script>
  import Pagination from '@/frame/components/Pagination'
  import formatter from '@/frame/utils/dataFormat'
  import {handleDelete, getData} from '@/frame/utils/common'
  import {$postPr} from '@/frame/utils/http'

  export default {
    computed: {
      // 多选删除，把选中行的jobId存入数组
      getDeleteArr() {
        const arr = []
        this.multipleSelection.forEach((item) => {
          arr.push(item.jobId)
        })
        return arr
      }
    },
    data() {
      return {
        fm: formatter,
        result: {},
        store: this.$store.state.ScheduleJob,
        router: this.$router,
        multipleSelection: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteData(singleId) {
        const param = {
          url: 'sys/schedule/delete',
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
          url: 'sys/schedule/list'
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
        this.router.push({name: 'scheduleEdit', params: {type: 'add'}})
      },
      // 编辑
      editPage(id) {
        this.store.jobId = id
        this.router.push({name: 'scheduleEdit'})
      },
      // 暂停
      pause() {
        $postPr('sys/schedule/pause', this.getDeleteArr)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                // 暂停成功
                message: this.$i('cooco_public_tips_pause_success')
              })
              this.getDataList()
            } else {
              this.$message({
                type: 'warning',
                // 暂停失败
                message: this.$i('cooco_public_tips_pause_failed') + ':' + res.data.msg
              })
            }
          })
      },
      confirmPause() {
        if (this.getDeleteArr.length === 0) {
          this.$message({
            type: 'warning',
            // 请选择一条记录
            message: this.$i('cooco_public_tips_select_data') + '!'
          })
        } else {
          // 确定要暂停选中的任务 信息
          this.$confirm(this.$i('cooco_public_tips_suspend_task'), this.$i('cooco_public_tips_message'), {
            // 确认
            confirmButtonText: this.$i('cooco_public_button_confirm'),
            // 取消
            cancelButtonText: this.$i('cooco_public_button_cancel'),
            type: 'warning'
          }).then(() => {
            this.pause()
          }).catch(() => {
            this.$message({
              type: 'info',
              // 已取消暂停
              message: this.$i('cooco_public_tips_cancel_pause')
            })
          })
        }
      },
      // 恢复
      resume() {
        $postPr('sys/schedule/resume', this.getDeleteArr)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: this.$i('cooco_public_tips_recover_success')
              })
              this.getDataList()
            } else {
              this.$message({
                type: 'warning',
                message: this.$i('cooco_public_tips_recover_unsuccess') + res.data.msg
              })
            }
          })
      },
      confirmResume() {
        if (this.getDeleteArr.length === 0) {
          this.$message({
            type: 'warning',
            // 请选择一条记录
            message: this.$i('cooco_public_tips_select_data') + '!'
          })
        } else {
          // 确定要恢复选中的任务
          this.$confirm(this.$i('cooco_public_tips_ensure_recover'), this.$i('cooco_public_tips_message'), {
            // 确定
            confirmButtonText: this.$i('cooco_public_button_confirm'),
            // 取消
            cancelButtonText: this.$i('cooco_public_button_cancel'),
            type: 'warning'
          }).then(() => {
            this.resume()
          }).catch(() => {
            this.$message({
              type: 'info',
              // 已取消恢复
              message: this.$i('cooco_public_tips_cancel_recover')
            })
          })
        }
      },
      // 立即执行
      run() {
        $postPr('sys/schedule/run', this.getDeleteArr)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                // 立即执行成功
                message: this.$i('cooco_public_tips_execution_success')
              })
              this.getDataList()
            } else {
              this.$message({
                type: 'warning',
                // 立即执行失败
                message: this.$i('cooco_public_tips_execution_unsuccess') + res.data.msg
              })
            }
          })
      },
      confirmRun() {
        if (this.getDeleteArr.length === 0) {
          this.$message({
            type: 'warning',
            // 请选择一条记录!
            message: this.$i('cooco_public_tips_select_data') + '!'
          })
        } else {
          // 确定要立即执行选中的任务
          this.$confirm(this.$i('cooco_public_tips_ensure_execution'), this.$i('cooco_public_tips_message'), {
            // 确定
            confirmButtonText: this.$i('cooco_public_button_confirm'),
            // 取消
            cancelButtonText: this.$i('cooco_public_button_cancel'),
            type: 'warning'
          }).then(() => {
            this.run()
          }).catch(() => {
            this.$message({
              type: 'info',
              // 已取消立即执行
              message: this.$i('cooco_public_tips_cancel_execution')
            })
          })
        }
      },
      logList() {
        this.router.push({name: 'scheduleLogList'})
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
  }
</script>
