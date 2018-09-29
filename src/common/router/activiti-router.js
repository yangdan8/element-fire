const activitiRouter = [
    {
        path: '/activitiModel',
        linkname: '流程定义',
        component: () => import('@/activiti/models'),
        children: [
            {
                path: '/',
                name: 'models',
                linkname: '模型列表',
                component: () => import('@/activiti/models/views/modelsList')
            },
            {
                path: '/modelsEdit',
                name: 'modelsEdit',
                linkname: '模型编辑',
                component: () => import('@/activiti/models/views/modelsEdit')
            }
        ]
    },
    {
        path: '/activitiProcess',
        linkname: '流程部署',
        component: () => import('@/activiti/process'),
        children: [
            {
                path: '/',
                name: 'process',
                linkname: '流程列表',
                component: () => import('@/activiti/process/views/processList')
            }
        ]
    },
    {
        path: '/leaveFlow',
        linkname: '请假单管理',
        component: () => import('@/activiti/flow'),
        children: [
            {
                path: '/',
                name: 'leaveflowList',
                linkname: '请假单列表',
                component: () => import('@/activiti/flow/views/leaveflowList')
            },
            {
                path: '/leaveflowEdit',
                name: 'leaveflowEdit',
                linkname: '请假单编辑',
                component: () => import('@/activiti/flow/views/leaveflowEdit')
            }
        ]
    },
    {
        path: '/task',
        linkname: '审批业务',
        component: () => import('@/activiti/task'),
        children: [
            {
                path: '/',
                name: 'taskList',
                linkname: '审批列表',
                component: () => import('@/activiti/task/views/taskList')
            },
            {
                path: '/taskEdit',
                name: 'taskEdit',
                linkname: '审批编辑',
                component: () => import('@/activiti/task/views/taskEdit')
            }
        ]
    },
    {
        path: '/myActivity',
        linkname: '',
        component: () => import('@/activiti/manage'),
        children: [
            {
                path: '/',
                name: 'myActivity',
                linkname: '流程管理',
                component: () => import('@/activiti/manage/views/myActivity')
            },
            {
                path: '/myActivityEdit',
                name: 'myActivityEdit',
                linkname: 'Edit',
                component: () => import('@/activiti/manage/views/myActivityEdit')
            }
        ]
    }
]

export default activitiRouter
