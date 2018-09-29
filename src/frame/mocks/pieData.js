const $pieEcharts = (data) => {
    // 一个序列 在图中表示一条线	
    const series1_data = [] // 序列数据1
    series1_data[0] = { name: '传统媒体', value: data.EXP1 }
    series1_data[1] = { name: '网络', value: data.EXP2 }
    series1_data[2] = { name: '电视台', value: data.EXP3 }
    const option = {
        // backgroundColor : "#f9f9f9",
        grid: { // grid组件
            bottom: 30,
            right: 40
        },
        title: { // 标题设置
            text: '2012年广告投入（万）',
            subtext: '',
            textStyle: {
                fontSize: 15 // 字体大小
            },
            x: 'center'
        },
        // 提示框组件 
        tooltip: {
            trigger: 'item', // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
		/*
		legend: {			
			x:'right',
			selectedMode:false ,
			data: []			
		},*/

        series: [
            {
                name: '类型',
                type: 'pie', // 图表类型
                radius: '85%',
                center: ['55%', '55%'],
                data: series1_data
            }
        ]
    }
    return option
}

export default $pieEcharts