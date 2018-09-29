<template>
  <section class="formEdit paper">
        <span class="title">
            <!-- 定时任务编辑 -->
            <span>{{$i('sysbase-schedule_job')}}{{$i('cooco_public_panel_edit')}}</span>
            <i class="el-icon-close" @click="closeWindow"></i>
        </span>
    <el-form :model="scheduleJob" :rules="rules" ref="scheduleJob" label-width="120px">
      <!--bean 名称-->
      <el-form-item :label="$i('sysbase-schedule_job-bean_name')" prop="beanName">
        <el-input v-model="scheduleJob.beanName"
                  :placeholder="$i('sysbase-schedule_job-bean_name_placeholder')"></el-input>
      </el-form-item>
      <!--方法名称-->
      <el-form-item :label="$i('sysbase-schedule_job-method_name')" prop="methodName">
        <el-input v-model="scheduleJob.methodName" :placeholder="$i('sysbase-schedule_job-method_name')"></el-input>
      </el-form-item>
      <!--参数-->
      <el-form-item :label="$i('sysbase-schedule_job-params')" prop="params">
        <el-input v-model="scheduleJob.params"></el-input>
      </el-form-item>
      <!--cron表达式-->
      <el-form-item :label="$i('sysbase-schedule_job-cron_expression')" prop="cronExpression">
        <el-input v-model="scheduleJob.cronExpression"
                  :placeholder="$i('sysbase-schedule_job-cron_expression_placeholder')"></el-input>
        <div>如：0 */2 * * * ? 表示每隔2分钟执行一次 ;一个cronExpression表达式有至少6个（也可能是7个）由空格分隔的时间元素,
          <br>格式如：秒 分 时 日 月 星期 年 , 详细可参考 https://blog.csdn.net/aspnet2002web/article/details/52810569
          <br>在以上各个字段中，还可以使用以下特殊字符：
          <br>星号（*）：代表所有可能的值，例如month字段如果是星号，则表示在满足其它字段的制约条件后每月都执行该命令操作。
          <br>逗号（,）：可以用逗号隔开的值指定一个列表范围，例如，“1,2,5,7,8,9”
          <br>中杠（-）：可以用整数之间的中杠表示一个整数范围，例如“2-6”表示“2,3,4,5,6”
          <br>正斜线（/）：可以用正斜线指定时间的间隔频率，例如“0-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如*/10，如果用在minute字段，表示每十分钟执行一次
        </div>
      </el-form-item>
      <!--备注-->
      <el-form-item :label="$i('sysbase-schedule_job-remark')" prop="remark">
        <el-input v-model="scheduleJob.remark" :placeholder="$i('sysbase-schedule_job-remark')"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <!-- 取消按钮 -->
      <el-button type="info" @click="closeWindow"><i class="el-icon-close"></i>{{$i("cooco_public_button_cancel")}}
      </el-button>
      <!-- 保存按钮 -->
      <el-button type="primary" class="wid-btn" @click="submit('scheduleJob')"
                 v-if="permissControl('sys:schedule:mgr')"><i class="el-icon-upload"></i>{{$i("cooco_public_button_save")}}
      </el-button>
    </div>
  </section>
</template>

<script>
import { ScheduleJobModel } from '@/sys/ScheduleJob/model/ScheduleJobModel'
import { get, post } from '@/frame/utils/common'

export default {
  data() {
    return {
      editState: true,
      store: this.$store.state.ScheduleJob,
      route: this.$route,
      router: this.$router,
      refs: this.$refs,

      scheduleJob: this.initFilter(new ScheduleJobModel()),
      rules: {
        beanName: [
          {
            required: true,
            // bean名称不能为空
            message: this.$i('sysbase-schedule_job-bean_name_not_null'),
            trigger: 'change'
          }
        ],
        methodName: [
          {
            required: true,
            // 方法名称不能为空
            message: this.$i('sysbase-schedule_job-method_name_not_null'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.refs[formName].validate((valid) => {
        if (valid) {
          const data = this.sendFilter(this.scheduleJob)
          post('sys/schedule/saveOrUpdate', data, () => {
            this.router.push({ name: 'scheduleList' })
          })
        } else {
          return false
        }
      }
      )
    },
    getData() {
      get('sys/schedule/info', { jobId: this.store.jobId }, (data) => {
        this.scheduleJob = data.schedule
      })
    },
    resetData(formName) {
      var refs = this.$refs
      refs[formName].resetFields()
    },
    closeWindow() {
      this.store.keepSearchCondition = true
      this.router.push({ name: 'scheduleList' })
    },
    sendFilter(data) {
      return data
    },
    initFilter(data) {
      if (!data) {
        return null
      }
      return data
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
      this.getData()
    }
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

.footer {
  padding-left: 160px;
  .wid-btn {
    width: 120px;
    span {
      width: 58px;
    }
  }
}
</style>

