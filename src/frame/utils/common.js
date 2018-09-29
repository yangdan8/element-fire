import { $get, $post, $postPr, $postQs } from '@/frame/utils/http'
import { deleteWarnMsg, actWarnMsg } from '@/frame/utils/msgConf'

// 用于存放作用域   --by q&xl at 2017-11-22
let scope = {}
const color = {
    onColor: '#13ce66',
    offColor: '#ff4949'
}
const langList = [
    {key: 'zh-CN', value: '中文(简)'},
    {key: 'zh-TW', value: '中文(繁)'},
    {key: 'en', value: '英文'}
]
const PictureDomain = 'http://7xp8zy.com1.z0.glb.clouddn.com/'
/**
 * 工具函数
 */

const _trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}
const _ltrim = (str) => {
    return str.replace(/(^\s*)/g, '')
}
const _rtrim = (str) => {
    return str.replace(/(\s*$)/g, '')
}

const _isEmpty = (para) => {
    if (typeof para === 'undefined') {
        return true
    } else if (typeof para === 'string') {
        return (_trim(para) === '')
    } else if (para instanceof Array) {
        return (para.length === 0)
    } else if (typeof para === 'object' && !(para instanceof Array)) {
        var para_name
        for (para_name in para) {
            return false
        }
        return true
    } else if (typeof para === 'number') {
        _isEmpty(para + '')
    }
}
/**
 * 数据字典语言切换
 * @param  string str为i18nName字段，JSONString
 * @param  string defa为默认语言，国际化未配置时显示
 * @return string 返回当前语言的数据
 */
const _setDictLang = (str, defa) => {
    const lang = localStorage.getItem('lang')
    try {
        if (_isEmpty(str) || JSON.parse(str)[lang] == null) {
            return defa
        } else {
            return JSON.parse(str)[lang]
        }
    } catch (e) {
        console.error('国际化出错, 值为：' + str)
        console.error(e)
    }
}
/**
 * 主菜单语言切换
 * @param  list   menulist
 * @return list   返回国际化后的菜单
 */
const _setMenuLang = (list, lang) => {
    for (var item in list) {
        list[item].name = JSON.parse(list[item].i18nName)[lang]
    }
    console.log(list)
    return list
}

// 国际化按钮语言切换
const showLang = (params) => {
    if (!params) {
        return '语言'
    }
    for (const i in langList) {
        if (langList[i].key === params) {
            return langList[i].value
        }
    }
}

const handleDelete = (param) => {
    if (!param || !param.url) {
        return
    }
    if (param.tableObj) {
        param.arr = []
        param.tableObj.selection.forEach((item) => {
            if (item[param.idName]) {
                param.arr.push(item[param.idName])
            } else {
                console.error('Primary key is not null')
                return
            }
        })
    }

    if (!param.id && (!param.arr || param.arr.length === 0)) {
        scope.$message({
          type: 'error',
          message: scope.$i('cooco_public_select_delete_records')
        })
        return
    }
    if (param.id) {
        param.arr = []
        param.arr.push(param.id)
    }
    const message = param.msg || deleteWarnMsg
    const deleteData = (arr) => {
        // 真正的删除操作
        $postPr(param.url, arr)
            .then((res) => {
                if (res.data.code === 0) {
                    scope.$message({
                        type: 'success',
                        message: scope.$i('cooco_public_confirm_delete_success')
                    })
                    param.callback()
                } else {
                    scope.$message({
                        type: 'warning',
                        message: scope.$i('cooco_public_confirm_delete_failed') + ':' + res.data.msg
                    })
                }
            })
    }
    scope.$confirm(message, scope.$i('cooco_public_confirm_tip'), {
        confirmButtonText: scope.$i('cooco_public_button_confirm'),
        cancelButtonText: scope.$i('cooco_public_button_cancel'),
        type: 'warning'
    }).then(() => {
        // 删除操作
        deleteData(param.arr)
    }).catch(() => {
        scope.$message({
            type: 'info',
            message: scope.$i('cooco_public_confirm_cancel')
        })
    })
}

// 弹窗提示操作
const handleData = (param) => {
    const message = param.msg || actWarnMsg
    const handleAct = (arr) => {
        // 真正的操作过程
        $postQs(param.url, arr)
            .then((res) => {
                if (res.data.code === 0) {
                    scope.$message({
                        type: 'success',
                        message: scope.$i('cooco_public_operation_success')
                    })
                    param.callback()
                } else {
                    scope.$message({
                        type: 'warning',
                        message: scope.$i('cooco_public_operation_failed') + ':' + res.data.msg
                    })
                }
            })
    }
    scope.$confirm(message, scope.$i('cooco_public_confirm_tip'), {
        confirmButtonText: scope.$i('cooco_public_button_confirm'),
        cancelButtonText: scope.$i('cooco_public_button_cancel'),
        type: 'warning'
    }).then(() => {
        // 操作
        handleAct(param.arr)
    }).catch(() => {
        scope.$message({
            type: 'info',
            message: scope.$i('cooco_public_confirm_cancel')
        })
    })
}

// 新增不请求服务器删除记录方法     --by q-xl at 2017-10-16
const itemDelete = (param) => {
    const message = param.msg || deleteWarnMsg
    scope.$confirm(message, scope.$i('cooco_public_confirm_tip'), {
        confirmButtonText: scope.$i('cooco_public_button_confirm'),
        cancelButtonText: scope.$i('cooco_public_button_cancel'),
        type: 'warning'
    }).then(() => {
        // 删除操作
        scope.$message({
            type: 'success',
            message: scope.$i('cooco_public_confirm_delete_success')
        })
        param.callback()
    }).catch(() => {
        scope.$message({
            type: 'info',
            message: scope.$i('cooco_public_confirm_cancel')
        })
    })
}

/**
 * getScope：获取全局作用域方法
 * @param  object obj 全局作用域对象，通常为this
 * by q&xl at 2017-11-22
 */
function getScope(obj) {
    scope = obj
}

function get(url, param, callback) {
    $get(url, param)
        .then((res) => {
            if (res.data.code === 0) {
                callback && callback(res.data)
            } else {
                scope.$message({
                    type: 'info',
                    message: scope.$i('cooco_public_update_failed') + '，' + res.data.msg
                })
            }
        })
}

function post(url, data, callback, failCallback) {
    $postPr(url, data)
        .then((res) => {
            if (res.data.code === 0) {
                /* 返回true，则不需要提示 */
                var tempFlag = callback && callback(res.data)
                if (!tempFlag) {
                    scope.$message({
                      type: 'success',
                      message: scope.$i('cooco_public_update_success')
                    })
                }
            } else {
                failCallback && failCallback()
                scope.$message({
                    type: 'info',
                    message: scope.$i('cooco_public_update_failed') + '，' + res.data.msg
                })
            }
        })
}

function getData(param) {
    return new Promise((resolve) => {
        $postQs(param.url, param.data)
            .then((res) => {
                if (res.data.code === 0) {
                    resolve(res.data.page)
                } else {
                    scope.$message({
                        type: 'info',
                        message: scope.$i('cooco_public_update_failed') + '，' + res.data.msg
                    })
                }
            })
    })
}

/**
    调用示例：
        toTree(res.data.menuList, 'menuId', 'parentId', 0)
    功能：把原始list列表的数据，根据parentId等上下级字段转化为饿了么的树型控件要求的树结构模型
    已知引用：菜单维护、公司授权等
    参数说明：
        data 原始的列表形式数据,如 [{menuId:1,parentId:0,menuName:'系统管理'}
        idKey data对象的id属性，如 id 或 menuId
        parentKey data对象的parentId属性，如 parentId
        parentId 根父节点id， 如 0
    返回：
        只返回叶子节点数组 [100]
*/
const toTree = (data, idKey, parentKey, parentId) => {
    const tree = []
    let child = []

    for (let i = 0, len = data.length; i < len; i++) {
        if (data[i][parentKey] != null && data[i][parentKey].toString() === parentId.toString()) {
            // self指当前循环到的对象
            const self = data[i]
            child = toTree(data, idKey, parentKey, data[i][idKey])
            if (child.length > 0) {
                self.children = child
                self.isLeaf = 0 // 是否叶子节点
            } else {
                self.isLeaf = 1
            }
            tree.push(self)
        }
    }
    return tree
}

/**
 * submitData 提交数据更新申请通用方法
 * params obj 包含url、data、scope、callback
 * 新增params.callback     --by q-xl at 2017-11-07
 */
const submitData = (params) => {
    $post(params.url, params.data)
        .then((res) => {
            if (res.data.code === 0) {
                params.callback()
                scope.$message({
                    type: 'success',
                    message: scope.$i('cooco_public_update_success')
                })
            } else {
                scope.$message({
                    type: 'warning',
                    message: scope.$i('cooco_public_update_failed') + '，' + res.data.msg
                })
            }
        })
}

/**
    调用示例：
        getEleCheckedKeysFromDb(this.originalTreeDataList, this.checkedNodeIdsFromDb, 'menuId')
    功能：数据库返回的包括父子节点勾选状态的数组，处理为饿了么要求的勾选状态的数组 如数据库checkedNodeIdsFromDb = [100,10,1]，其中100，200是叶子节点
        10是父节点，1是祖父节点， 饿了么要求只设置 100的勾选状态即可，他会自动虚拟勾选10和1 ，同时100的同级节点200不会勾选 ，
        处理后的返回数组为 [100]
    已知引用：角色授权页面等
    参数说明：
        originalTreeDataList 原始的列表形式的所需树的数据,如 从数据库获取的菜单数据(经过toTree函数处理过，isLeaf节点有对应的赋值)
        idKey data对象的id属性，如 id 或 menuId
        checkedNodeIdsFromDb 数据库勾选值数组如 [100,10,1]
    返回：
        只返回叶子节点数组 [100]
*/
const getEleCheckedKeysFromDb = (originalTreeDataList, checkedNodeIdsFromDb, idKey) => {
    const elTreeCheckKeys = []
    if (checkedNodeIdsFromDb != null && checkedNodeIdsFromDb.length > 0) {
        for (let i = 0, len = checkedNodeIdsFromDb.length; i < len; i++) {
            for (let k = 0, len2 = originalTreeDataList.length; k < len2; k++) {
                if (originalTreeDataList[k][idKey] === checkedNodeIdsFromDb[i]) {
                    if (originalTreeDataList[k]['isLeaf'] === 1) {
                        elTreeCheckKeys.push(checkedNodeIdsFromDb[i])
                    }
                }
            }
        }
    }
    return elTreeCheckKeys
}

/**
 * zdy 添加
 * 调用示例：
        getCheckNodeKeysToDb(this.originalTreeDataList, this.$refs.tree.getCheckedKeys(), 'menuId', 'parentId')
 * [handleCheckKeysToArrayForElmTree description]
 * 功能：将饿了么树控件中，选择的某叶子节点，自动查找其父节点直到根，把keys添加到要返回的数组中resultCheckedKes ，例如选择了某叶子节点
        100 ，调用此函数后，会 查找 100的所有父和祖父节点，并插入到resultCheckedKes 数组中，如返回结果 resultCheckedKes = [100,10,1]
    已知引用：角色授权页面等
    参数说明：
        data 原始的列表形式的所需树的数据,如 从数据库获取的菜单数据
        idKey data对象的id属性，如 id 或 menuId
        parentKey data对象的parentId属性 ,如 parentId
        oneId 某id值 ，如 100
        resultCheckedKes 传入的要返回的数组对象， 必须先初始化，如  resultCheckedKes = []
*/
const getCheckNodeKeysToDb = (originalTreeDataList, elmCheckedKeys, idKey, parentKey) => {
    const result = elmCheckedKeys
    const tempIdsArray = []
    /*
        功能：getCheckNodeKeysToDb 函数调用的 private 函数
    */
    function handleCheckKeysToArrayForElmTree(data, idKey, parentKey, oneId, resultCheckedKes) {
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i][idKey] === oneId) {
                if (!arrayisExistsKey(resultCheckedKes, oneId)) {
                    resultCheckedKes.push(oneId)
                }
                const parentId = data[i][parentKey]
                if (parentId != null && parentId !== 0) {
                    handleCheckKeysToArrayForElmTree(data, idKey, parentKey, parentId, resultCheckedKes)
                    if (!arrayisExistsKey(resultCheckedKes, parentId)) {
                        resultCheckedKes.push(parentId)
                    }
                }
            }
        }
    }
    if (result != null && result.length > 0) {
        for (let i = 0, len = result.length; i < len; i++) {
            handleCheckKeysToArrayForElmTree(originalTreeDataList, idKey, parentKey, result[i], tempIdsArray)
        }
    }
    return tempIdsArray
}

/*
    功能：某简单数组是否包含某key
    已知引用：角色授权页面等
    参数说明：
        arr 简单数组，如 [1,2,3]
        id 某id值 ，如 1
    返回 true ，false
*/
const arrayisExistsKey = (arr, id) => {
    let exists = false
    if (arr != null) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === id) {
                exists = true
                break
            }
        }
    }
    return exists
}

/*
    调用示例：
            getDict('demo-gslb', this.bizPropertySelectList, this.formData, 'bizProperty', false)
    功能： 初始化饿了么 下拉框控件（根据通用属性--数据字典配置）,会把后台数据写到Vue对象对应的 data数组中，以便页面下拉框双向绑定
    已知引用：demo-单表公司等
    参数说明：
        categoryCode 通用属性类别，来自 sys_configdictitem表 categoryCode字段 ，如 'demo-gslb'
        selectListObj 页面下拉框对应的optionList，在Vue对象的data中定义，是一个数组[]。 如 this.bizPropertySelectList
        formData 页面表单对应的modul 对象 ，如 this.formData
        selectModelName 页面表单下拉框对应的model属性， 如  'bizProperty'
        isSetDefaultValue 是否设置默认值
*/
var codeCache = {}
function toSetDefaultValue(categoryCode, formData, selectListObj, selectModelName, isSetDefaultValue) {
    if (!selectListObj || selectListObj.length === 0) {
        for (var j = 0; j < codeCache[categoryCode].length; j++) {
            selectListObj.push(codeCache[categoryCode][j])
        }
    }
    if (!formData) {
        return
    }
    if (Object.prototype.toString.call(formData) === '[object Array]') {
        for (var k = 0; k < formData.length; k++) {
            var itemData = formData[k]
            for (var h = 0; h < selectListObj.length; h++) {
                var temp = selectListObj[h]
                if (itemData[selectModelName] != null && itemData[selectModelName] !== undefined) {
                    if (itemData[selectModelName].toLowerCase().toString() === temp.itemCode.toLowerCase()) {
                        itemData[selectModelName] = temp.itemCode.toLowerCase()
                        break
                    }
                }
            }
        }
    } else {
        if (isSetDefaultValue && _isEmpty(formData[selectModelName])) {
            for (var i = 0; i < selectListObj.length; i++) {
                var tempOption = selectListObj[i]
                if (tempOption.isDefault * 1 === 1) {
                    formData[selectModelName] = tempOption.itemCode
                    break
                }
            }
        } else {
            for (var m = 0; m < selectListObj.length; m++) {
                var row = selectListObj[m]
                if (formData[selectModelName] !== null && formData[selectModelName] !== undefined) {
                    if (formData[selectModelName].toLowerCase().toString() === row.itemCode.toLowerCase()) {
                        formData[selectModelName] = row.itemCode
                        break
                    }
                }
            }
        }
    }
}

const cleanCache = () => {
    codeCache = {}
}

/**
 * saveDict 从接口获取通用数据字典，并保存至store
 * by q-xl at 2017-11-30
 */
const saveDict = () => {
    const getDict = (url) => {
        return new Promise((resolve) => {
            $get(url)
                .then(res => {
                    if (res.data.code === 0 && res.data.data != null) {
                        resolve(res.data.data)
                    } else {
                        console.error('数据获取失败:' + res.data.msg)
                    }
                })
                .catch((err) => {
                  console.log(err)
                })
          })
    }
    const renderData = async () => {
        scope.$store.state.dictList = await getDict('sys/configDict/getAllDictItemMap')
    }
    renderData()
}
/**
 * translateDict 根据获取到的数据字典结果集转换显示结果
 * @param  string code 需要处理的值所对应的通用数据字典集
 * @param  string val 需要处理的值
 * @param direct 为false则是正向(通过val找name)，为true是逆向(通过val找code)
 * @return string val       转换处理完成的值
 * by q-xl at 2017-11-30
 */
const translateDict = (code, val, direct) => {
    if (val === null || val === undefined || !code) {
        return val
    }
    code = code.toLowerCase()
    var values = val.split(',')
    for (var v in values) {
        values[v] = translate(code, values[v], direct)
    }
    return values.join(',')
}

const translate = (code, val, direct) => {
  if (scope.$store.state.dictList) {
      var result = scope.$store.state.dictList[code]
      if (result) {
          for (const item in result) {
              if (!direct) {
                  if (result[item].itemCode === val.toLowerCase().toString()) {
                      result[item].itemName = scope.$i(code + '-' + result[item].itemCode)
                      return result[item].itemName
                  }
              } else {
                  if (result[item].itemName === val.toLowerCase().toString()) {
                      return result[item].itemCode
                  }
              }
          }
      }
  }
}

/*
 调用示例：
 fillDict('demo-student-nationalityDict', newStudent.nationalityDictList, newStudent, 'nationalityDict', true)
 功能： 初始化饿了么 下拉框控件（根据通用属性--数据字典配置）,会把后台数据写到Vue对象对应的 data数组中，以便页面下拉框双向绑定
 已知引用：demo-单表公司等
 参数说明：
 categoryCode 通用属性类别，来自 sys_configdictitem表 categoryCode字段 ，如 'demo-gslb'
 selectListObj 页面下拉框对应的optionList，在Vue对象的data中定义，是一个数组[]。 如 this.bizPropertySelectList
 formData 页面表单对应的modul 对象 ，如 this.formData
 selectModelName 页面表单下拉框对应的model属性， 如  'bizProperty'
 isSetDefaultValue 是否设置默认值
 */
const fillDict = (categoryCode, selectListObj, formData, selectModelName, isSetDefaultValue) => {
    const param = {
        url: 'sys/configDictitem/listByCategoryCode',
        data: {
            categoryCode: categoryCode
        }
    }
    if (codeCache[categoryCode]) {
        // const codeCacheLength = codeCache[categoryCode].length
        // for (let i = 0; i < codeCacheLength; i++) {
        //     codeCache[categoryCode][i].itemName = _setDictLang(codeCache[categoryCode][i].i18nName, codeCache[categoryCode][i].itemName)
        // }
        toSetDefaultValue(categoryCode, formData, selectListObj, selectModelName, isSetDefaultValue)
        return
    }
    $postQs(param.url, param.data).then(res => {
        if (selectListObj == null) {
            selectListObj = []
        }
        if (res.data.code === 0 && res.data.list != null) {
            // selectListObj = res.data.list 这样子不会双向绑定，因为vue的数组后面如果更改了地址是不行的，必须是push
            const resList = res.data.list
            selectListObj.splice(0, selectListObj.length)
            for (var j = 0; j < resList.length; j++) {
                // resList[j].itemName = _setDictLang(resList[j].i18nName, resList[j].itemName)
                selectListObj.push(resList[j])
            }
            codeCache[categoryCode] = selectListObj
            toSetDefaultValue(categoryCode, formData, selectListObj, selectModelName, isSetDefaultValue)
        } else {
            console.error('数据获取失败:' + res.data.msg)
            selectListObj = []
        }
    })
}

/**
 * zdy 添加
 * [getElCheckedKeys description]
     功能：数据库返回的包括父子节点勾选状态的数组，处理为饿了么要求的勾选状态的数组 如数据库checkedNodeIdsFromDb = [100,10,1]，其中100，200是叶子节点
            10是父节点，1是祖父节点， 饿了么要求只设置 100的勾选状态即可，他会自动虚拟勾选10和1 ，同时100的同级节点200不会勾选 ，
            处理后的返回数组为 [100]
    已知引用：角色授权页面等
    参数说明：
        originalTreeDataList 原始的列表形式的所需树的数据,如 从数据库获取的菜单数据(经过toTree函数处理过，isLeaf节点有对应的赋值)
        idKey data对象的id属性，如 id 或 menuId
        checkedNodeIdsFromDb 数据库勾选值数组如 [100,10,1]
    返回：
        只返回叶子节点数组 [100]
*/
const getElCheckedKeys = (originalTreeDataList, checkedNodeIdsFromDb, idKey) => {
    const elTreeCheckKeys = []
    if (checkedNodeIdsFromDb != null && checkedNodeIdsFromDb.length > 0) {
        for (let i = 0, len = checkedNodeIdsFromDb.length; i < len; i++) {
            for (let k = 0, len2 = originalTreeDataList.length; k < len2; k++) {
                if (originalTreeDataList[k][idKey] === checkedNodeIdsFromDb[i]) {
                    if (originalTreeDataList[k]['isLeaf'] === 1) {
                        elTreeCheckKeys.push(checkedNodeIdsFromDb[i])
                    }
                }
            }
        }
    }
    return elTreeCheckKeys
}

/**
 * 获取菜单及权限
 * @return { promise } 成功获取值之后才渲染菜单
 * by q-xl at 2017-11-14
 */
const getMenuUser = () => {
    return new Promise((resolve) => {
        $get('sys/menu/user')
          .then((res) => {
              if (res.data.code === 0) {
                  resolve(res.data)
              }
          })
          .catch((err) => {
              console.log(err)
          })
      })
}

/**
 * 工具函数名前要加下划线
 */

export {
    color,
    PictureDomain,
    handleDelete,
    handleData,
    itemDelete,
    getData,
    getScope,
    get,
    post,
    toTree,
    submitData,
    getEleCheckedKeysFromDb,
    getCheckNodeKeysToDb,
    translateDict,
    saveDict,
    fillDict,
    arrayisExistsKey,
    getElCheckedKeys,
    getMenuUser,
    showLang,
    langList,
    // 工具函数
    _isEmpty,
    _trim,
    _ltrim,
    _rtrim,
    _setDictLang,
    _setMenuLang,
    cleanCache
}

/**
 * 工具函数名前要加下划线
 */
