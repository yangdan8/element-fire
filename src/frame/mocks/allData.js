const $allEcharts = (data) => {
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
        /* grid: {
            bottom: 30,
            right: 40
        }, */
        title: {
            text: '近5年广告投入',
            subtext: '',
            textStyle: {
                fontSize: 15
            },
            x: 'center',
            top: 25
        },

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            /* x: 'right',
            selectedMode: false, */
            data: ['传统媒体', '网络', '电视台']
        },
        toolbox: { // 工具箱，每个图表最多仅有一个工具箱
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']}, // magicType，动态类型切换，支持直角系下的折线图、柱状图、堆积、平铺转换
                restore: {show: true},
                saveAsImage: {show: true}
            }
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
                barGap: '0%',                
                // barCategoryGap: '40%',
                data: series1_data
            },
            {
                name: '网络',
                type: 'bar',               
                barGap: '10%',
                // barCategoryGap: '40%',
                data: series2_data
            },
            {
                name: '电视台',
                type: 'bar',               
                barGap: '20%',
                // barCategoryGap: '40%',
                data: series3_data
            }
        ]       
    }
    return option
}
export default $allEcharts

/* const allEcharts = {
        title: { // 标题设置
            text: '测试标题',
            x: 'center', // 水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
            y: 'top'// 垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）   
        },
        tooltip: { // 提示框，鼠标悬浮交互时的信息提示
            trigger: 'axis' // 触发类型，默认（'item'）数据触发，可选为：'item' | 'axis'
        },
        legend: { // 图例，每个图表最多仅有一个图例
            x: 'center',
            y: 'bottom',
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        toolbox: { // 工具箱，每个图表最多仅有一个工具箱
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']}, // magicType，动态类型切换，支持直角系下的折线图、柱状图、堆积、平铺转换
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true, // 坐标轴两端空白策略
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: lineData
    }    */