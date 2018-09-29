<template>
  <section class="formList">
      <div id="echarts">
        <div id="pieChart"></div>
        <div id="lineChart"></div>
        <div id="myChart"></div>
        <div id="twinLineChart"></div>
        <div id="allEcharts"></div>
      </div>    
  </section>
</template>
<script>
import mockData from '@/frame/mocks'
import { $news_detail_gnzsCtpi_showCharts } from '@/frame/mocks/execData'
import $lineEcharts from '@/frame/mocks/lineData'
import $pieEcharts from '@/frame/mocks/pieData'
import $chartEcharts from '@/frame/mocks/chartData'
import $allEcharts from '@/frame/mocks/allData'
require('echarts/theme/macarons') // echarts 主题
export default {
  data() {
    return {
      chart: {},
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const pieChart = this.$echarts.init(document.getElementById('pieChart'), 'macarons')
      const lineChart = this.$echarts.init(document.getElementById('lineChart'), 'macarons')
      const myChart = this.$echarts.init(document.getElementById('myChart'), 'macarons')
      const twinLineChart = this.$echarts.init(document.getElementById('twinLineChart'), 'macarons')
      const allEcharts = this.$echarts.init(document.getElementById('allEcharts'), 'macarons')
      // loading 的动画来提示用户数据正在加载
      // this.chart.showLoading()  
      // 饼图
      pieChart.setOption($pieEcharts(mockData.data1Arr[0]))
      // 折线图
      lineChart.setOption($lineEcharts(mockData.data1Arr))
      // 柱状图
      myChart.setOption($chartEcharts(mockData.data1Arr))
      // 双y轴折线图
      const execData = [{ 'EXECDATE': 1476633600000, 'EXP4': null, 'EXP3': 122.48, 'EXP2': 120.23, 'EXP1': 539.9 }, { 'EXECDATE': 1477238400000, 'EXP4': null, 'EXP3': 126, 'EXP2': 127.02, 'EXP1': 552.4 }, { 'EXECDATE': 1477843200000, 'EXP4': null, 'EXP3': 128.07, 'EXP2': 129.6, 'EXP1': 552.4 }, { 'EXECDATE': 1478448000000, 'EXP4': null, 'EXP3': 130.72, 'EXP2': 134.86, 'EXP1': 552.4 }, { 'EXECDATE': 1479052800000, 'EXP4': null, 'EXP3': 130.6, 'EXP2': 135.97, 'EXP1': 545.72 }, { 'EXECDATE': 1479657600000, 'EXP4': null, 'EXP3': 130.45, 'EXP2': 139.24, 'EXP1': 545.72 }, { 'EXECDATE': 1480262400000, 'EXP4': null, 'EXP3': 130.43, 'EXP2': 139.81, 'EXP1': 545.72 }, { 'EXECDATE': 1480867200000, 'EXP4': null, 'EXP3': 129.57, 'EXP2': 139.64, 'EXP1': 545.7 }, { 'EXECDATE': 1481472000000, 'EXP4': null, 'EXP3': 129.45, 'EXP2': 139.9, 'EXP1': 563.72 }]
      const option = $news_detail_gnzsCtpi_showCharts(execData)
      // console.log(option)
      twinLineChart.setOption(option)
      // 总图
      allEcharts.setOption($allEcharts(mockData.data1Arr))
    }
  }
}
</script>
<style lang="less" scoped>
section {
    > div {
        overflow: auto;
        background:#fff; 
        div {
            width: 600px;
            height:400px;
            float:left;
            margin-bottom: 30px;
            margin-left: 5px;
            box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
        }
    }
    @media screen and (min-width: 767px) {
        > div {
            display: inline-block;
            > div {
                display: inline-block;
                flex-shrink: 0;
                width: 49.5%;
                &:last-child {
                    width: 100%;
                }
            }
        } 
    }
}
</style>



