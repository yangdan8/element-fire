<template>
    <el-pagination @size-change="handleSize" @current-change="handleCurrent" :current-page="currPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="totalCount" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
</template>
<script>
import { getData } from '@/frame/utils/common'
export default {
    props: ['result', 'url', 'param'],
    computed: {
        totalCount() {
            return this.result.totalCount
        },
        currPage() {
            return this.result.currPage
        },
        pageSize() {
            return this.result.pageSize
        }
    },
    methods: {
        handleSize(val) {
            this.param.postData.limit = val
            var params = {
                data: Object.assign(this.param.postData),
                url: this.url
            }
            this.render(params)
        },
        handleCurrent(val) {
            // 改变当前页
            if (this.param.postData.page === val) {
                return
            } else {
                this.param.postData.page = val
                var params = {
                    data: this.param.postData,
                    url: this.url
                }
                this.render(params)
            }
        },
        render(params) {
            const renderData = async () => {
                const data = await getData(params)
                this.$emit('update:result', data)
            }
            renderData()
        }
    }
}
</script>
<style lang="less">
.el-pagination {
  margin: 20px auto;
  text-align: center;
  .el-pager {
        .active {
            background: #177bbb;
            color: #fff;
        }
    }
}
</style>

