/**
 * 功能：常规日期格式化方法.
   调用如：
   common_formatDate(1477324800000, 1, '/')  返回 2016/10/25
   common_formatDate(1477324800000, 2, '/')  返回 10/25
   common_formatDate("2016-10-25",1,"/")   返回 2016/10/25
 * @param date  js 日期对象或字符串或 unix时间戳
 * @param flag 1或2  1:从年开始  2：从月开始
 * @param separator 分割符
 * @returns  字符串
 */
function common_formatDate(date, flag, separator) {
	var d = new Date(date)
	if (flag === 1) {
		return d.getFullYear() + separator + (d.getMonth() + 1) + separator + d.getDate()
	} else if (flag === 2) {
		return (d.getMonth() + 1) + separator + d.getDate()
	}
}
function $news_detail_gnzsCtpi_showCharts(data) {
	const xData = [] // x轴分类数据category 	
	const series1_data = [] // 序列数据1 ，本例中代表 ctpi
	const series2_data = []
	const series3_data = []	
	const dataLen = data.length
	for (var i = 0; i < dataLen; i++) {
		xData[i] = common_formatDate(data[i].EXECDATE, 1, '/') // 转换为 yyyy-mm-dd格式		
		series1_data[i] = data[i].EXP1
		series2_data[i] = data[i].EXP2
		series3_data[i] = data[i].EXP3		
	}	
	// news_detail_gnzsCtpi_charts = echarts.init(document.getElementById('detail_gnzsCtpi_charts'), "macarons")
	// var option = news_getDefautChartsOption()
	const option = {
		// backgroundColor : "#f9f9f9", 
		grid: {
			bottom: 30, 
			right: 40
		}, 
		title: {
			text: '中国太原煤炭交易价格指数（CTPI）', 
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
			x: 'right', 
			selectedMode: false, 
			data: ['Q5500动力煤价格', '煤炭交易综合价格指数', '动力煤价格指数']			
		}, 
		xAxis: {
			axisLine: {
				lineStyle: {
					// color : "#006400", 
				}
			}, 
			data: xData, 
			axisLabel: {
                formatter: (value) => {
                    var date = new Date(value)
                    return [date.getFullYear().toString().substring(2), date.getMonth() + 1, date.getDate()].join('/')					
                }
            }, 
			boundaryGap: false	
		}, 
		yAxis: [
				{
					name: '指数:点', 
					type: 'value', 
					scale: true					
				}, 
				{
					name: '价格：元/吨', 
					type: 'value', 
					scale: true					
				}
				
		], 
		series: [
            {
                name: 'Q5500动力煤价格', 
				type: 'line', 	
				yAxisIndex: 1, 			
				data: series1_data, 
				itemStyle: {
					normal: {
						// color: 'blue', 
						lineStyle: {        
							// width: 1
						}
					}
				}
            },
            {
                name: '煤炭交易综合价格指数', 
				type: 'line', 
				yAxisIndex: 0, 
				data: series2_data, 
				itemStyle: {
					normal: {
						// color: 'green'
                    }
                }
            },
            {
                name: '动力煤价格指数', 
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
export { $news_detail_gnzsCtpi_showCharts }