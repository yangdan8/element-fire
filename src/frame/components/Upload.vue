<template>
    <el-upload class="avatar-uploader"
    :ref="refName"
    :action="IMGSERVER+'sys/fileUpload2db/upload'"
    name="files"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :before-upload="beforeAvatarUpload"
    :show-file-list="!imgalone"
    :datasource="datasource"
    :file-list="fileList"
    :limit="mount" 
    :on-exceed="handleExceed"
    :imgalone="imgalone"
    :list-type="listtype"
   >

    <el-button v-if="imgalone !==1" class="click-ripple" size="small" type="primary">點擊上傳</el-button>
    <img v-if="(imgalone ===1) && imgId" :src="IMGSERVER + 'sys/fileUpload2db/getFile?fileId=' + imgId" class="avatar">
    <i v-if="(imgalone === 1) && !imgId" class="material-icons upload-icon">add</i>

    </el-upload>
    <!--
    Element自带参数:
        action 服务端接口
        name 服务端接口参数名
        on-success 文件上传成功时的钩子	function(response, file, fileList)
        on-remove 文件列表移除文件时的钩子 function(file, fileList)
        before-upload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。	function(file)
        show-file-list 是否显示已上传文件列表(如果是单图片显示，这里应为false
        file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        list-type 文件列表的类型 text/picture/picture-card (这个只是显示样式不同)
        limit	最大允许上传个数
        on-exceed	文件超出个数限制时的钩子
    以下是封装自加的参数：
        imgalone 是否是单图片显示类型，这种类型的前端显示效果跟其他类型不同
        datasource 初始数据源
     过程中使用到的变量意义：
        fileList 上传的图片信息
        returnList 另行封装上传的图片信息，用于传回去保存数据库
        keyName 图片对应的字段名，为了传回去
        imgId 单图片显示时用到的图片信息

        使用样例：

        1.单图片上传
        <upload :datasource="owlRentinfo.idfFrontFile" :keyName="'idfFrontFile'" :listtype="'picture'" @success="uploadSuccess" :imgalone="1"></upload>
        2.限定上传文件数目的上传（显示样式为文件格式）
        <upload :datasource="owlRentinfo.contractFile" :keyName="'contractFile'" :mount="1" :listtype="'text'" @success="uploadSuccess"></upload>
        3.限定上传文件数目的上传（显示样式为卡牌格式）
        <upload :datasource="owlRentinfo.contractFile" :keyName="'contractFile'" :mount="1" :listtype="'picture-card'" @success="uploadSuccess"></upload>
     -->
</template>
<script>
import bus from '@/frame/utils/eventBus'
import { $IMGSERVER } from '@/frame/utils/http'

export default {
    name: 'upload',
    props: ['datasource', 'mount', 'keyName', 'listtype', 'imgalone', 'refName'],
    data() {
        return {
            IMGSERVER: $IMGSERVER,
            fileList: [],
            imgId: '',
            returnList: [],
            returnStr: '',
            _datasource: ''
        }
    },
    watch: {
        'datasource': 'init'
    },
    mounted() {
        bus.$on('clear', () => {
            this._datasource = this.imgId = ''
            this.$refs[this.refName] && this.$refs[this.refName].clearFiles()
        })
    },
    methods: {
        init(val) {
            this._datasource = val
            if (this._datasource) {
                this.fileList = []
                this.returnList = []
                if (this.imgalone !== 1) { // 多图上传保存的是个数组的json格式
                    const fileRes = JSON.parse(this._datasource)
                    this.imgId = fileRes[0].id
                    for (const fi in fileRes) {
                        this.fileList.push({ 'name': fileRes[fi].name, 'id': fileRes[fi].id, 'url': this.IMGSERVER + 'sys/fileUpload2db/getFile?fileId=' + fileRes[fi].id })
                        this.returnList.push({'name': fileRes[fi].name, 'id': fileRes[fi].id })
                        this.returnStr = JSON.stringify(this.returnList)
                    }
                } else { // 单图片上传只保存单个id信息
                    this.imgId = this._datasource
                    this.returnStr = this.imgId
                }
            }
        },
        handleRemove(file) {
            // 可选参数, 文件列表移除文件时的钩子
            for (const ci in this.fileList) {
                if (this.fileList[ci].id === file.id) {
                    this.fileList.splice(ci, 1)
                    this.returnList.splice(ci, 1)
                    this.returnStr = JSON.stringify(this.returnList)
                    this.$emit('success', {
                        list: this.returnStr,
                        key: this.keyName
                    })
                    break
                }
            }
        },
        handleSuccess(res, file) {
            // 可选参数, 文件上传成功时的钩子
            if (this.imgalone !== 1) {
                this.fileList.push({ 'name': res['data'][0].filename, 'id': res['data'][0].id, 'url': file.url })
                this.returnList.push({ 'name': res['data'][0].filename, 'id': res['data'][0].id })
                this.returnStr = JSON.stringify(this.returnList)
            } else {
                this.imgId = res['data'][0].id
                // this.returnList[0] = { 'name': res['data'][0].filename, 'id': res['data'][0].id }
                // console.log(this.returnList)
                this.returnStr = this.imgId
            }
            this.$emit('success', {
                list: this.returnStr,
                key: this.keyName
            })
        },
        // 文件上传通用方法End
        // 文件上传 限定文件类型和大小时候用到
        handleExceed(fileList) {
            this.$message.warning(`限制上傳 1 个文件，當前已經上傳了 ${fileList.length} 个文件`)
        },
        beforeAvatarUpload(file) {
            // 图片处理
            // 根据显示类型做简单的类型检查
            const isJPG = file.type.match('image') || this.listtype === 'text'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        }
    }
}
</script>
