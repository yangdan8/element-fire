function date(row, column, cellValue) {
    // long to YYYY-MM-DD
    if (cellValue) {
        const date = new Date(cellValue)
        const Y = date.getFullYear()
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        const D = date.getDate()
        return Y + '-' + M + '-' + D
    } else {
        return null
    }
}

function datetime(row, column, cellValue) {
    // long to YYYY-MM-DD
    if (cellValue) {
        const date = new Date(cellValue)
        const Y = date.getFullYear()
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        const D = date.getDate()
        const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
    } else {
        return null
    }
}

export {
    date,
    datetime
}
