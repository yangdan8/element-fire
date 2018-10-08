<template>
    <section class="TreeView">
        <div class="tree-panel" :class="{'tree-shrink':isShrink}">
            <div class="tree-header" ref="treeHeader">
                <slot name="header"></slot>
            </div>
            <div class="tree-block" ref="treeBlock">
                <slot name="tree"></slot>
            </div>
            <div class="shrinkBtn" @click="toggleShrink">
                <!-- {{isShrink?'收起':'展开'}} -->
                <Icon type="md-arrow-dropright-circle" />
            </div>
        </div>
        <div class="view-panel" ref="viewPanel">
            <slot name="view"></slot>
        </div>
    </section>
</template>

<script>
/**
 * 左树右表组件
 */
export default {
    'name': 'TreeView',
    'props': {
        'height': {
            'type': String,
            'default': ''
        }
    },
    data() {
        return {
            'isShrink': false
        };
    },
    'computed': {
        'treeHeight': function () {
            let result = this.height;

            if (result) {
                // calc公式
                if (result.includes('calc')) {
                    const leftBracket = this.height.indexOf('(');
                    const rightBracket = this.height.indexOf(')');

                    result = result.substring(leftBracket + 1, rightBracket);
                }
                result += ` - ${this.$refs.treeHeader.offsetHeight}px`;
                result = `calc(${result})`;
            }
            return result;
        }
    },
    'methods': {
        toggleShrink() {
            this.isShrink = !this.isShrink;
        }
    },
    'watch': {
        '$route.path': {
            'handler': function (val) {
                if (this.isShrink) {
                    this.isShrink = false;
                }
            }
        }
    },
    mounted() {
        if (!this.height) {
            const hNav = 60;
            const viewPadding = 20 + 20;
            const cardHeader = 51;
            const cardBodyPadding = 32;
            const cardBorder = 2;
            const sum = hNav + viewPadding + cardHeader + cardBodyPadding + cardBorder;
            const maxHeight = `calc(${window.innerHeight}px - ${sum}px - ${this.$refs.treeHeader.offsetHeight}px)`;

            this.$refs.treeBlock.style.maxHeight = maxHeight;
            this.$refs.viewPanel.style.maxHeight = `calc(${window.innerHeight}px - ${sum}px)`;
        } else {
            this.$refs.treeBlock.style.maxHeight = this.treeHeight;
            this.$refs.viewPanel.style.maxHeight = this.height;
        }
    }
};
</script>

<style lang="less">
.TreeView {
  display: flex;
  .scrollBar {
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-track {
      /*外层轨道，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置3）*/
      background: #f6f6f6;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面可以拖动的那部分（位置5）*/
      background: #aaa;
      border-radius: 10px;
      &:hover {
        background: #747474;
      }
    }
    &::-webkit-scrollbar-corner {
      /*边角（位置6）*/
      background: #f6f6f6;
    }
  }
  .tree-panel {
    width: 250px;
    margin-right: 10px;
    .tree-block {
      overflow: auto;
      .scrollBar();
    }
    .shrinkBtn {
      display: none;
    }
    @media screen and (max-width: 768px) {
      position: fixed;
      top: 131px;
      left: 0;
      z-index: 1;
      background: #fff;
      border-radius: 0 0 4px 0;
      box-shadow: 1px 1px 1px 1px #bbb;
      transform: translate3d(-101%, 0, 0);
      transition: transform 0.3s;
      .tree-block {
        height: 300px;
      }
      .shrinkBtn {
        position: absolute;
        top: 0;
        left: 251px;
        display: block;
        width: 30px;
        padding: 3px 8px;
        background: #fff;
        box-shadow: 1px 1px 1px 1px #bbb;
        border-radius: 0 4px 4px 0;
        z-index: 1;
        &:before {
          content: "展开";
          display: inline;
        }
      }
      &.tree-shrink {
        transform: translate3d(0, 0, 0);
        .shrinkBtn {
          &:before {
            content: "收起";
          }
          .ivu-icon {
            transform: rotate(180deg);
            transition: transform 0.3s;
          }
        }
      }
    }
  }
  .view-panel {
    flex: 1;
    overflow-x: auto;
    .scrollBar();
  }
}
</style>