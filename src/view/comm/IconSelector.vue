<template>
    <section class="IconSelector">
        <Modal v-model="modalVisible" title="选择图标" width="780" @on-ok="ok" @on-cancel="cancel" class-name="scroll-modal">
            <div class="search">
                <input type="text" v-model="searchKey" :placeholder="placeholder" @focus="handleFocus" @blur="blurFocus">
            </div>
            <div class="icons">
                <div class="icon-item" v-for="(i,index) in iconsSearch" :key="index" @click="selectChange(i)">
                    <Icon :type="i" size="32" />
                    <p>{{i}}</p>
                </div>
            </div>
        </Modal>
    </section>
</template>

<script>
/**
 * 图标选择器组件
 * @param {Boolean} visible
 * @returns {Function} ok(selected)
 */
export default {
    'name': 'IconSelector', // 公用组件单词首字母大写，业务组件驼峰命名
    'props': ['visible'],
    data() {
        return {
            'modalVisible': false,
            'icons': require('./icon.json'),
            'result': '',
            'placeholder': '输入英文关键词搜索, 如success',
            'searchKey': ''
        };
    },
    'computed': {
        iconsSearch() {
            const result = [];
            const icons = Object.assign([], this.icons);

            if (this.searchKey) {
                icons.forEach(v => {
                    v.includes(this.searchKey) && result.push(v);
                });
            } else {
                result.push(...icons);
            }
            return result;
        }
    },
    'watch': {
        'visible': {
            'handler': function (val) {
                this.modalVisible = val;
            },
            'immediate': true
        }
    },
    'methods': {
        selectChange(i) {
            this.result = i;
            this.ok();
        },
        ok() {
            this.$emit('ok', this.result);
            this.close();
        },
        cancel() {
            this.close();
        },
        close() {
            this.searchKey = '';
            this.$emit('update:visible', false);
        },
        handleFocus() {
            this.placeholder = '';
        },
        blurFocus() {
            this.placeholder = '输入英文关键词搜索, 如success';
        }
    }
};
</script>

<style lang="less" scoped>
.icons {
  display: flex;
  flex-wrap: wrap;
}
.icon-item {
  width: 145px;
  text-align: center;
  cursor: pointer;
  height: 90px;
  color: #5c6b77;
  transition: all 0.2s ease;
  padding-top: 10px;
}
.search {
  position: relative;
  margin: 20px auto 30px;
  text-align: center;
  input {
    width: 60%;
    box-sizing: border-box;
    border: 0;
    border-radius: 4px;
    background: #f5f5f5;
    text-align: center;
    font-size: 14px;
    outline: none;
    margin: 0 auto;
    padding: 8px 0;
  }
}
</style>