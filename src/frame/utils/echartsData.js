// data表示列表数据,xProp表示x坐标值所在的key，yProp表示y坐标值所在的key
// 柱状图和折线图都可引用此方法
function $chartData(data, xProp, yProp) {
    const list = data.data.page.list
    const xAxisData = []
    const yAxisData = []
    list.forEach((element) => {
        xAxisData.push(element[xProp])
        yAxisData.push(element[yProp])
       // console.log(element.totalMoney)     
    }, this)
    const map = new Map([
        ['xAxis', xAxisData],
        ['yAxis', yAxisData]
      ])
      return map
}
// data表示列表数据,name表示每个饼块代表的名称所在的key，value代表每个饼块具体的数值所在的key
// 饼状图引用此方法
function $pieData(data, name, value) {
    const list = data.data.page.list
    const legendData = []
    const seriesData = []
    list.forEach( (element) => {
        legendData.push(element[name])
        seriesData.push({ value: element[value], name: element[name] })
    }, this)
    const map = new Map([
        ['legend', legendData],
        ['series', seriesData]
    ])
     return map
}

export { $chartData, $pieData }