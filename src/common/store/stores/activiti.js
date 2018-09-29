// 以下放activiti
import activitiModels from '@/activiti/models/store/activitiModels'
import activitiProcess from '@/activiti/process/store/activitiProcess'
import activitiLeaveflow from '@/activiti/Flow/store/demoLeaveflowStore'
import activitTask from '@/activiti/task/store/taskStore'
import activitManage from '@/activiti/manage/store/myActivityStore'

const activiti = {
    activitiModels,
    activitiProcess,
    activitiLeaveflow,
    activitTask,
    activitManage
}
export default activiti