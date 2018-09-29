import moment from 'moment'

function date(row, column, d) {
    if (!d) {
        return ''
    }
    return moment(d).format('YYYY-MM-DD')
}

function datetime(row, column, d) {
    if (!d) {
        return ''
    }
    return moment(d).format('YYYY-MM-DD HH:mm:ss')
}

function datec(d, formatStyle) {
  if (!d) {
    return ''
  }
  return moment(d).format(formatStyle)
}

export default {
    date,
    datetime,
    datec
}
