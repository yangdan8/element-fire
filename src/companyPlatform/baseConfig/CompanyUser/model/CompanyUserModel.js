const CompanyUserModel = () => {
    return {
        userId: null,
        username: '',
        password: '',
        email: '',
        mobile: '',
        status: true,
        createUserId: '',
        companyId: '',
        nickname: '',
        logoId: '',
        sex: 0,
        isAdmin: 0,
        isSleep: 0,
        roleIdList: []
    }    
}

export { CompanyUserModel }

/**
     `user_id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(100) DEFAULT NULL COMMENT '手机号',
  `status` tinyint(4) DEFAULT NULL COMMENT '状态  0：禁用   1：正常',
  `create_user_id` varchar(36) DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `companyId` varchar(36) DEFAULT NULL COMMENT '所属公司',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `logoId` varchar(256) DEFAULT NULL COMMENT '用户头像',
  `sex` tinyint(5) DEFAULT NULL COMMENT '性别',
  `isAdmin` tinyint(5) DEFAULT '0' COMMENT '是否指定的公司管理员',
     */
