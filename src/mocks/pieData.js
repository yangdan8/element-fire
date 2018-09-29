const pieData = [
    { value: 120, name: '邮件营销' },
    { value: 220, name: '联盟广告' },
    { value: 150, name: '视频广告' },
    { value: 320, name: '直接访问' },
    { value: 820, name: '搜索引擎' }
]
const pieEcharts = {
    title: {
        text: '测试标题',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        x: 'center',
        y: 'bottom',
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    calculable: true,
    series: [
        {
            name: '测试标题',
            type: 'pie',
            // roseType: 'radius',
            data: pieData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
        }
    ]
}

export default pieEcharts