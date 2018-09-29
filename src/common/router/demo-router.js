
const demoRouter = [    
    {
        path: '/echarts',
        name: 'echarts',
        linkname: '图表控件测试',
        component: () => import('@/demo/charts/views/echarts')
    }
]

export default demoRouter
