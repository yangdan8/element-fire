<template>
    <section class="Radios">
        <RadioGroup v-model="selfValue" @on-change="handleChange" :vertical="vertical" :size="size" :type="type">
            <Radio :label="r.label" v-for="(r,i) in radioList" :key="i" :disabled="r.disabled">{{r.name}}</Radio>
        </RadioGroup>
    </section>
</template>

<script>
/**
 * 基于iview单选组件
 * https://www.iviewui.com/components/radio
 * @param {Array<String | Number | Object>} radios 选项数组
 * @param {String} name 选项展示的字段名
 * @param {String} label 选项值的字段名，字段值只能是简单数据类型
 *
 * example：
 * types = [{ name: '菜单', value: '0' },{ name: '按钮', value: '1' }]
 * <Radios v-model="data4Form.type" :radios="types" label="value"></Radios>
 *
 */
export default {
    'name': 'Radios', // 公用组件单词首字母大写，业务组件驼峰命名
    'props': {
        'value': {
            'type': [String, Number],
            'default': ''
        },
        'radios': {
            'type': Array,
            'default': function () {
                return [];
            }
        },
        'name': {
            'type': String,
            'default': 'name'
        },
        'label': {
            'type': String,
            'default': 'name'
        },
        'size': {
            validator(value) {
                return ['small', 'large', 'default'].includes(value);
            }
        },
        'type': {
            validator(value) {
                return ['button'].includes(value);
            }
        },
        'vertical': {
            'type': Boolean,
            'default': false
        }
    },
    data() {
        return {
            'selfValue': ''
        };
    },
    'computed': {
        'radioList': function () {
            const result = [];

            for (const r of this.radios) {
                if (r === null || r === undefined) {
                    result.push({
                        'name': Object.prototype.toString.call(r),
                        'label': Object.prototype.toString.call(r)
                    });
                    continue;
                }
                if (typeof r === 'object') {
                    result.push({
                        'name': r[this.name],
                        'label': r[this.label],
                        'disabled': r.disabled
                    });
                } else {
                    result.push({ 'name': r, 'label': r });
                }
            }
            return result;
        }
    },
    'methods': {
        handleChange(val) {
            this.$emit('on-change', val);
        }
    },
    'watch': {
        'value': {
            'handler': function (val) {
                this.selfValue = val;
            },
            'immediate': true
        },
        'selfValue': function (val) {
            this.$emit('input', val);
        }
    }
};
</script>