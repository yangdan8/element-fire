const $chartEcharts = (data) => {
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
        // backgroundColor : '#f9f9f9',
        grid: { // grid组件
            bottom: 30,
            right: 40
        },
        // 标题设置
        title: {
            text: '近5年广告投入',
            subtext: '',
            textStyle: {
                fontSize: 15 // 字体大小
            },
            x: 'center', // 标题位置
            top: 25
        },
        // 提示框组件
        tooltip: {
            trigger: 'axis' // 坐标轴触发，axis 主要在柱状图，折线图等会使用类目轴的图表中使用。
        },
        legend: {
            x: 'right',
            selectedMode: false,
            data: ['传统媒体', '网络', '电视台']
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisLabel: {
                    // 刻度值可以再自定义
                    formatter: function(value) { // 第二个参数是 idx 如 function (value,idx)
                        return value + '年'
                    }
                }               
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '万'
            }
        ],
        series: [
            {
                name: '传统媒体',
                type: 'bar',
                barGap: '0%', // 柱间距离
                stack: '总量',
                // barCategoryGap: '40%',
                data: series1_data
            },
            {
                name: '网络',
                type: 'bar',
                stack: '总量',
                barGap: '0%',
                // barCategoryGap: '40%',
                data: series2_data
            },
            {
                name: '电视台',
                type: 'bar',
                stack: '总量',
                barGap: '0%',
                // barCategoryGap: '40%',
                data: series3_data
            }
        ]
    }
    return option
}

export default $chartEcharts