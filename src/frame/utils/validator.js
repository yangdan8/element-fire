const testPhone = (rule, value, callback) => {
    if (value) {
        !/^1[34578]\d{9}$/.test(value) ? callback(new Error('请输入正确的手机号')) : callback()
    } else {
        callback()
    }
}

const testNumber = (rule, value, callback) => {
    if (value) {
        !/^[0-9]*$/.test(value) || value === '' ? callback(new Error('请输入整数')) : callback()
    } else {
        callback()
    }
}

const testFloat = (rule, value, callback) => {
    if (value) {
        !/^(-?\d+)(\.\d+)?$/.test(value) ? callback(new Error('请输入数字')) : callback()
    } else {
        callback()
    }
}

export {
    testPhone,
    testNumber,
    testFloat
}
