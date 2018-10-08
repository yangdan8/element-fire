<template>
    <section class="RichText">
        <div :id="editorId">
            {{value}}
        </div>
        <!-- <div class="resize-box" :style="resizeBoxStyle">
            <div class="resizable-handle resizable-handle-e"></div>
            <div class="resizable-handle resizable-handle-s"></div>
            <div class="resizable-handle resizable-handle-se"></div>
        </div> -->
    </section>
</template>

<script>
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { $http, $FILESERVER } from '@/services/http';
import Quill from 'quill';

// 必须使用style控制样式, 而不用class，因为别的端会用到这里的html片段
// 字体大小
const Size = Quill.import('attributors/style/size');

Size.whitelist = ['16px', '17px', '18px', '19px', '20px', '25px', '30px'];
Quill.register(Size, true);

// 文本对齐
const Align = Quill.import('attributors/style/align');

Align.whitelist = ['right', 'center', 'justify'];
Quill.register(Align, true);

// 字体
// var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif', 'monospace'];
// var Font = Quill.import('attributors/style/font');
// Font.whitelist = fonts; //将字体加入到白名单
// Quill.register(Font, true);

/**
 * 基于Quill的富文本编辑器
 */
export default {
    'name': 'RichText',
    'props': {
        'value': {
            'type': String,
            'default': ''
        },
        'config': {
            'type': Object,
            'default': () => { }
        },
        'readOnly': {
            'type': Boolean,
            'default': false
        },
        'placeholder': {
            'type': String,
            'default': '请输入...'
        },
        'height': {
            'type': [String, Number],
            'default': '100%'
        },
        'theme': {
            validator(value) {
                return ['snow', 'bubble'].includes(value);
            },
            'default': 'snow'
        }
    },
    data() {
        return {
            'editorId': 'editor_' + new Date().getTime(),
            'quill': null,
            'options': {
                'modules': {
                    'toolbar': [
                        // [{ 'font': fonts }], // 字体
                        [{ 'size': Size.whitelist }], // 字体大小
                        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike', { 'header': 1 }, { 'header': 2 }], // toggled buttons
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
                        // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                        // [{ 'direction': 'rtl' }],                         // text direction

                        // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        ['blockquote', 'image', 'link']
                        // ['clean']
                    ]
                    // ImageResize:{}
                },
                'readOnly': this.readOnly,
                'placeholder': this.readOnly ? '' : this.placeholder,
                'theme': this.theme
            },
            'currContent': '',
            'timer': null, // 简易去除抖动的定时器
            'imgInput': null,
            'uploadUrl': $FILESERVER + 'v1/file/upload' // 图片上传的地址
            // resizeBoxStyle: {}
        };
    },
    'methods': {
        update(delta) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.quill.getLength() > 1) { // this.quill.getLength()===1时内容是空的
                    this.currContent = this.quill.container.firstChild.innerHTML;
                } else {
                    this.currContent = '';
                }
                this.$emit('input', this.currContent);
            }, 500);
        },
        uploadImage() {
            if (!this.imgInput) {
                this.imgInput = document.createElement('input');
                this.imgInput.setAttribute('type', 'file');
                this.imgInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                this.imgInput.classList.add('ql-image');
                this.imgInput.addEventListener('change', () => {
                    if (this.imgInput.files && this.imgInput.files[0]) {
                        const formData = new FormData();

                        formData.append('file', this.imgInput.files[0]);
                        $http.post(this.uploadUrl, formData).then(data => {
                            const range = this.quill.getSelection(true);

                            this.quill.insertEmbed(range.index, 'image', String(data));
                            this.quill.setSelection(range.index + 1);
                            this.imgInput.value = '';
                        }).catch(() => {
                            this.imgInput.value = '';
                        });
                    }
                });
            }
            this.imgInput.click();
        },
        setHandle() {
            const toolbar = this.quill.getModule('toolbar');
            // 图片上传

            toolbar.addHandler('image', (value) => {
                value && this.uploadImage();
            });
            // resize
            const vm = this;

            this.$el.querySelector('.ql-editor').onclick = function (evt) {
                const e = evt || window.event;
                const target = e.target || e.srcElement;

                if (target.tagName === 'IMG') {
                    console.log(vm.quill.getBounds());
                    // vm.resizeBoxStyle = {
                    //     display: 'block',
                    //     top: (target.offsetTop + 42 - 2) + 'px',
                    //     left: (target.offsetLeft + 2) + 'px',
                    //     width: (target.offsetWidth - 4) + 'px',
                    //     height: (target.offsetHeight + 4) + 'px'
                    // }
                } else {
                    // vm.resizeBoxStyle.display = 'none'
                }
            };
        }
    },
    'components': {},
    'filters': {},
    'watch': {
        'value': function (val) {
            if (val !== this.currContent) {
                this.quill.container.firstChild.innerHTML = val;
            }
        }
    },
    mounted() {
        // 设置
        const options = Object.assign({}, this.options, this.config);
        // 初始化

        this.quill = new Quill('#' + this.editorId, options);
        // 监听文本变化
        this.quill.on('text-change', this.update);
        // 设置高度
        const _height = typeof this.height === 'string' ? this.height : this.height + 'px';

        this.quill.container.firstChild.style.height = _height;
        // 设置默认字体大小
        this.quill.format('size', '16px');
        // 初始化内容
        this.quill.container.firstChild.innerHTML = this.value;
        // 添加事件
        this.setHandle();
    }
};
</script>

<style lang="less">
@import "../../styles/RichText.less";
.resize-box {
  display: none;
  position: absolute;
  border: 1px solid #ddd;
  //   .resizable-handle {
  //     position: absolute;
  //     font-size: 0.1px;
  //     display: block;
  //     touch-action: none;
  //     &-e {
  //       cursor: e-resize;
  //       width: 7px;
  //       right: -5px;
  //       top: 0;
  //       height: 100%;
  //     }
  //     &-s {
  //       cursor: s-resize;
  //       height: 7px;
  //       width: 100%;
  //       bottom: -5px;
  //       left: 0;
  //     }
  //     &-se {
  //       cursor: se-resize;
  //       width: 12px;
  //       height: 12px;
  //       right: 2px;
  //       bottom: 2px;
  //       border-width: 0px 3px 3px 0px;
  //       border-color: #b5b4b4;
  //       border-style: solid;
  //     }
  //   }
}
</style>