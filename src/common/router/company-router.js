const companyRouter = [
    /* {
        path: '/companyRole',
        linkname: '公司角色管理',
        component: () => import('@/companyPlatform/baseConfig/CompanyRole'),
        children: [
            {
                path: '/',
                name: 'companyRoleList',
                linkname: '公司角色管理列表',
                component: () => import('@/companyPlatform/baseConfig/CompanyRole/views/companyRoleList')
            },
            {
                path: '/companyRoleEdit',
                name: 'companyRoleEdit',
                linkname: '公司角色管理编辑',
                component: () => import('@/companyPlatform/baseConfig/CompanyRole/views/companyRoleEdit')
            }
        ]
    }, */
    {
        path: '/companyRole',
        linkname: '公司角色管理',
        component: () => import('@/companyPlatform/baseConfig/CompanyRole'),
        children: [
            {
                path: '/',
                name: 'companyRoleList',
                linkname: '公司角色管理列表',
                component: () => import('@/companyPlatform/baseConfig/CompanyRole/views/SysRole')
            },
            {
                path: '/companyRoleEdit',
                name: 'companyRoleEdit',
                linkname: '公司角色管理编辑',
                component: () => import('@/companyPlatform/baseConfig/CompanyRole/views/SysRoleEdit')
            }
        ]
    },
    {
        path: '/companyUser',
        linkname: '公司用户管理',
        component: () => import('@/companyPlatform/baseConfig/CompanyUser'),
        children: [
            {
                path: '/',
                name: 'companyUser',
                linkname: '公司用户列表',
                component: () => import('@/companyPlatform/baseConfig/CompanyUser/views/CompanyUser')
            },
            {
                path: '/companyUserEdit',
                name: 'companyUserEdit',
                linkname: '公司用户编辑',
                component: () => import('@/companyPlatform/baseConfig/CompanyUser/views/CompanyUserEdit')
            }
        ]
    }    
]
export default companyRouter