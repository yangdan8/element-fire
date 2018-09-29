const $lineEcharts = (data) => {
    const xData = [] // x轴分类数据category 
    // 一个序列 在图中表示一条线	
    const series1_data = [] // 序列数据1 ，本例中代表值传统媒体
    const series2_data = [] // 网络
    const series3_data = [] // 电视台   
    // 对后台数据进行加工处理，识别出X轴分类和 Y轴序列数据
    for (var i = 0, j = data.length; i < j; i++) {
        xData[i] = data[i].EXECDATE	// X轴分类刻度数据
        series1_data[i] = data[i].EXP1
        series2_data[i] = data[i].EXP2
        series3_data[i] = data[i].EXP3
    }
    const option = {
        // 调整图表的大小可以在外部调整div的长宽或者调整grid组件离div容器上下左右侧的距离
        // backgroundColor : "#f9f9f9",
        grid: { // grid组件 
            bottom: 30, // grid 组件离容器下侧的距离
            right: 40 // grid 组件离容器右侧的距离
        },
        title: { // 标题设置
            text: '近5年广告投入',
            subtext: '', // 副标题
            textStyle: {
                fontSize: 15 // 字体大小
            },
            x: 'center', // 标题位置
            top: 5 // 标题距离容器上侧的距离
        },
        tooltip: { // 提示框组件
            trigger: 'axis' // 坐标轴触发，axis 主要在柱状图，折线图等会使用类目轴的图表中使用。
        },
        // 图例
        legend: {
            x: 'right', // 图例位置
            selectedMode: false, // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态
            data: ['传统媒体', '网络', '电视台']
        },
        // x轴
        xAxis: {
            axisLine: {
                lineStyle: { // 坐标轴轴线相关设置
                    // color : '#006400',
                }
            },
            data: xData,
            axisLabel: { // 坐标轴刻度标签的相关设置
                // 刻度值可以再自定义
                formatter: function(value) { // 第二个参数是 idx 如 function (value,idx)
                    return value + '年'
                }
            },
            boundaryGap: false // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
        },
        // y轴
        yAxis: [
            {
                name: '万', // y坐标轴名称
                type: 'value', // 坐标轴类型,value为数值轴
                scale: true // 是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度。
            }
        ],
        series: [
            {
                name: '传统媒体', // 系列名称，用于tooltip提示框的显示
                type: 'line', // 图表类型
                yAxisIndex: 0, // 使用的 y 轴的 index，在单个图表实例中存在多个 y 轴的时候有用
                data: series1_data,
                itemStyle: {
                    normal: {
                        // color: 'blue'  可以自定义线的颜色
                    }
                }
            },
            {
                name: '网络',
                type: 'line',
                yAxisIndex: 0,
                data: series2_data,
                itemStyle: {
                    normal: {
                        // color: 'red'
                    }
                }
            },
            {
                name: '电视台',
                type: 'line',
                yAxisIndex: 0,
                data: series3_data,
                itemStyle: {
                    normal: {
                        // color: 'red'
                    }
                }
            }
        ]
    }    
    return option
}
export default $lineEcharts