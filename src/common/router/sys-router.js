const sysRouter = [
    {
        path: '/sysCompany',
        linkname: '公司管理',
        component: () => import('@/sys/SysCompany'),
        children: [
            {
                path: '/',
                name: 'sysCompanyList',
                linkname: '公司管理列表',
                component: () => import('@/sys/SysCompany/views/sysCompany')
            },
            {
                path: '/sysCompanyEdit',
                name: 'sysCompanyEdit',
                linkname: '公司管理编辑',
                component: () => import('@/sys/SysCompany/views/sysCompanyEdit')
            }
        ]
    },
    {
        path: '/menu',
        name: 'menu',
        linkname: '菜单管理',
        component: () => import('@/sys/Menu'),
        children: [
            {
                path: 'tree-form/:menuId/:name',
                name: 'menuTable',
                linkname: '菜单管理详情',
                component: () => import('@/sys/Menu/views/menuTable')
            }
        ]
    },
    {
        path: '/schedule',
        linkname: '定时任务',
        component: () => import('@/sys/ScheduleJob'),
        children: [
            {
                path: '/',
                name: 'scheduleList',
                linkname: '定时任务列表',
                component: () => import('@/sys/ScheduleJob/views/ScheduleJob')
            },
            {
                path: '/scheduleEdit',
                name: 'scheduleEdit',
                linkname: '定时任务编辑',
                component: () => import('@/sys/ScheduleJob/views/ScheduleJobEdit')
            },
            {
                path: '/scheduleLog-list',
                name: 'scheduleLogList',
                linkname: '定时任务日志',
                component: () => import('@/sys/ScheduleJob/views/ScheduleJobLog')
            }
        ]
    },
    {
        path: '/sysLog',
        name: 'sysLog',
        linkname: '系统日志',
        component: () => import('@/sys/SysLog/views/sysLog')
    },
    {
        path: '/code-config/',
        name: 'sysConfigDict',
        linkname: '通用代码配置',
        component: () => import('@/sys/SysConfigDict/views/sysConfigDict'),
        children: [
            {
                path: ' ',
                name: 'sysConfigDictItem',
                linkname: '通用代码配置列表',
                component: () => import('@/sys/SysConfigDict/views/sysConfigDictItem')
            },
            {
                path: '  ',
                name: 'sysConfigDictEdit',
                linkname: '通用代码配置详情',
                component: () => import('@/sys/SysConfigDict/views/sysConfigDictEdit')
            }
        ]
    },
    {
        path: '/generate-code',
        name: 'generateCode',
        linkname: '生成代码例子',
        component: () => import('@/sys/generateCode/views/generateCode')
    },
    {
        path: '/druid',
        name: 'druid',
        linkname: '性能监控',
        component: () => import('@/sys/SysDruid/druid')
    },
    {
        path: '/sysI18nCode',
        linkname: '国际化code值配置',
        component: () => import('@/sys/SysI18nCode'),
        children: [
            {
                path: '/',
                name: 'sysI18nCode',
                linkname: '国际化code值配置',
                component: () => import('@/sys/SysI18nCode/views/SysI18nCode')
            },
            {
                path: '/sysI18nCodeEdit',
                name: 'sysI18nCodeEdit',
                linkname: '国际化code值配置Edit',
                component: () => import('@/sys/SysI18nCode/views/SysI18nCodeEdit')
            },
            {
                path: '/sysI18nCodeView',
                name: 'sysI18nCodeView',
                linkname: '国际化code值配置View',
                component: () => import('@/sys/SysI18nCode/views/SysI18nCodeView')
            }
        ]
    },

    {
      path: '/sysSuit',
        name: 'sysSuit',
      linkname: '系统套餐表',
      component: () => import('@/sysbase/suit/SysSuit'),
      children: [
      {
        path: '/',
        name: 'sysSuit',
        linkname: '系统套餐表',
        component: () => import('@/sysbase/suit/SysSuit/views/SysSuit')
    },
      {
        path: '/sysSuitEdit',
          name: 'sysSuitEdit',
        linkname: '系统套餐表Edit',
        component: () => import('@/sysbase/suit/SysSuit/views/SysSuitEdit')
      },
      {
        path: '/sysSuitView',
          name: 'sysSuitView',
        linkname: '系统套餐表View',
        component: () => import('@/sysbase/suit/SysSuit/views/SysSuitView')
      }
    ]
    },

    {
      path: '/sysSuitMenu',
        name: 'sysSuitMenu',
      linkname: '',
      component: () => import('@/sysbase/suit/SysSuitMenu'),
      children: [
      {
        path: '/',
        name: 'sysSuitMenu',
        linkname: '',
        component: () => import('@/sysbase/suit/SysSuitMenu/views/SysSuitMenu')
    },
      {
        path: '/sysSuitMenuEdit',
          name: 'sysSuitMenuEdit',
        linkname: 'Edit',
        component: () => import('@/sysbase/suit/SysSuitMenu/views/SysSuitMenuEdit')
      },
      {
        path: '/sysSuitMenuView',
          name: 'sysSuitMenuView',
        linkname: 'View',
        component: () => import('@/sysbase/suit/SysSuitMenu/views/SysSuitMenuView')
      }
    ]
    },

    {
      path: '/sysSuitSell',
        name: 'sysSuitSell',
      linkname: '',
      component: () => import('@/sysbase/suit/SysSuitSell'),
      children: [
      {
        path: '/',
        name: 'sysSuitSell',
        linkname: '',
        component: () => import('@/sysbase/suit/SysSuitSell/views/SysSuitSell')
    },
      {
        path: '/sysSuitSellEdit',
          name: 'sysSuitSellEdit',
        linkname: 'Edit',
        component: () => import('@/sysbase/suit/SysSuitSell/views/SysSuitSellEdit')
      },
      {
        path: '/sysSuitSellView',
          name: 'sysSuitSellView',
        linkname: 'View',
        component: () => import('@/sysbase/suit/SysSuitSell/views/SysSuitSellView')
      }
    ]
    }

]

export default sysRouter
