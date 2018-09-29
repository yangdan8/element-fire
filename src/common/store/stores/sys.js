// 以下放sys
import sysCompany from '@/sys/SysCompany/store/SysCompanyStore'
import sysConfigDict from '@/sys/SysConfigDict/store/sysConfigDictStore'
import SysLog from '@/sys/SysLog/store/SysLogStore'
import ScheduleJob from '@/sys/ScheduleJob/store/ScheduleJobStore'
import ScheduleJobLog from '@/sys/ScheduleJob/store/ScheduleJobLogStore'
import GenerateCode from '@/sys/generateCode/store/GenerateCodeStore'
import SysI18nCode from '@/sys/SysI18nCode/store/SysI18nCodeStore'

const sys = {
    sysCompany,
    sysConfigDict,
    SysLog,
    ScheduleJob,
    ScheduleJobLog,
    GenerateCode,
    SysI18nCode
}

export default sys