const chartData = [
    {
        name: '邮件营销',
        type: 'bar',
        stack: '总量', // 当柱状图为不堆积及平铺柱状图时，将每个stack的值都设为不同的值即可
        barWidth: 30, // 柱图宽度
        data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
        name: '联盟广告',
        type: 'bar',
        stack: '总量',
        barWidth: 30, // 柱图宽度
        data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
        name: '视频广告',
        type: 'bar',
        stack: '总量',
        barWidth: 30, // 柱图宽度
        data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
        name: '直接访问',
        type: 'bar',
        stack: '总量',
        barWidth: 30, // 柱图宽度
        data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
        name: '搜索引擎',
        type: 'bar',
        stack: '总量',
        barWidth: 30, // 柱图宽度
        data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
]

const chartEcharts = {
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
    calculable: true,
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '数量'
        }
    ],
    series: chartData
}

export default chartEcharts