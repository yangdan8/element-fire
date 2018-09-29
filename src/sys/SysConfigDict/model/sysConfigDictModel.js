const SysConfigDictModel = (pid) => {
    return {
        category: '',
        categoryName: '',
        orderNum: 0,
        parentId: pid,
        remark: '',
        tempExplain: '',
        uid: null
    }
}

/**
 * Model – 主表
    CREATE TABLE `sys_configdict` (
      `uid` varchar(36) NOT NULL,
      `category` varchar(32) DEFAULT NULL COMMENT '分类码',
      `categoryName` varchar(128) DEFAULT NULL COMMENT '分类名称',
      `parentId` varchar(64) DEFAULT NULL COMMENT '上级ID',
      `orderNum` int(10) DEFAULT NULL COMMENT '排序号',
      `tempExplain` varchar(256) DEFAULT NULL COMMENT '从表备用字段描述',
      `remark` varchar(128) DEFAULT NULL COMMENT '备注',
      PRIMARY KEY (`uid`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='通用配置字典';

 */

const SysConfigDictItemModel = () => {
    return {
        isDefault: 0,
        isRemoved: 0,
        itemCode: '',
        itemName: '',
        i18nName: '',
        zhCnName: '',
        zhTwName: '',
        enUsName: '',
        mainId: '',
        orderNum: 0,
        remark: '',
        tempC1: '',
        tempC2: '',
        tempC3: '',
        tempC4: '',
        tempC5: '',
        uid: ''
    }
}

/**
 * CREATE TABLE `sys_configdictitem` (
  `uid` varchar(36) NOT NULL,
  `mainId` varchar(36) DEFAULT NULL COMMENT '主表ID',
  `itemCode` varchar(32) NOT NULL COMMENT '编码',
  `itemName` varchar(64) DEFAULT NULL COMMENT '显示名称',
  `orderNum` int(10) DEFAULT NULL COMMENT '排序',
  `isRemoved` tinyint(1) DEFAULT NULL COMMENT '是否移除（暂废，假删除）',
  `isDefault` tinyint(1) DEFAULT NULL COMMENT '是否默认选项（下拉框时用到）',
  `tempC1` varchar(64) DEFAULT NULL COMMENT '备用字段1',
  `tempC2` varchar(64) DEFAULT NULL,
  `tempC3` varchar(64) DEFAULT NULL,
  `tempC4` varchar(64) DEFAULT NULL,
  `tempC5` varchar(64) DEFAULT NULL,
  `remark` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='通用代码配置-从表';

 */

const ConditionModel = (categoryCode) => {
    return {
        categoryCode: categoryCode,
        itemCode: '',
        itemName: ''
    }
}

export { SysConfigDictModel, ConditionModel, SysConfigDictItemModel }