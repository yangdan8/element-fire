<template>
  <div>
      <script :id=id type="text/plain"></script>
  </div>
</template>
<script>
  export default {
      watch: {
          defaultMsg: function(val) {
              this.setUEContent(val)
          }
      },
      props: ['defaultMsg', 'id'],
      name: 'Ueditor',
      data() {
          return {
              editor: null,
              UEConfig: {
                  initialFrameWidth: null,
                  initialFrameHeight: 350,
                  elementPathEnabled: false,
                  onready: () => {
                      this.setUEContent(this.defaultMsg)
                  }
              }
          }
      },
      mounted() {
          this.editor = window.UE.getEditor(this.id, this.UEConfig) // 初始化UE
      },
      methods: {
          getUEContent() { // 获取内容方法
              return this.editor.getContent()
          },
          setUEContent(str) {
              // console.log(typeof this.editor.body, this.editor.body)
              if (typeof this.editor.body !== 'undefined') {
                  this.editor.setContent(str)
              }
          }
      },
      destroyed() {
          this.editor.destroy()
      }
  }
</script>
