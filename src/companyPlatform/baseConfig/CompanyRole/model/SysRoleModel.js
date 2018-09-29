const SysRoleModel = () => {
    return {
        roleId: null,
        companyId: '',
        roleCode: '',
        roleName: '',
        remark: '',
        menuIdList: [], // 拥有的权限点
        createUserId: ''
    }
}

export { SysRoleModel }
