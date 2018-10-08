<template>
  <section class="dict">
    <Card dis-hover>
      <p slot="title">
        <Icon type="md-list-box"></Icon>
        <!-- {{$store.state.app.activeMenu.title}} -->重点单位
      </p>
      <Row class="table-search-bar">
        <Col :xs="24" :md="17" :lg="19">
        <Input v-model="searchParams.label" search @on-change="handleSearch" placeholder="标签名..." />
        </Col>
        <Col :xs="24" :md="7" :lg="5">
        <Button type="primary" icon="md-add" @click="add">新增</Button>
        <!-- <Poptip title="确定删除吗?" placement="bottom" confirm transfer @on-ok="del">
                    <Button type="error" icon="md-trash">删除</Button>
                </Poptip> -->
        </Col>
      </Row>
      <Row class="searchable-table-con1">
        <Table ref="table" :columns="columns" :data="dataSource.records" :loading="$store.state.app.isLoading"></Table>
        <Pager class="margin-top-10" :config="dataSource" @on-change="handlePager"></Pager>
      </Row>
    </Card>
  </section>
</template>

<script>
import Pager from '@/view/comm/Pager.vue';
import debounce from '@/libs/debounce';
import date from '@/filters/date';
import { $http } from '@/services/http';

export default {
  name: 'dict', // 公用组件单词首字母大写，业务组件驼峰命名
  data() {
    const _columns = [
      {
        type: 'index',
        align: 'center',
        fixed: 'left',
        width: 60
      },
      {
        title: '标签名',
        key: 'label',
        ellipsis: true,
        minWidth: 4 * 15 + 36,
        render: (h, params) => (
          <a onClick={() => this.edit(params.row)}>{params.row.label}</a>
        )
      },
      {
        title: '数据值',
        key: 'value',
        ellipsis: true,
        minWidth: 4 * 15 + 36
      },
      {
        title: '类型',
        key: 'type',
        ellipsis: true,
        minWidth: 3 * 15 + 36
      },
      {
        title: '描述',
        key: 'description',
        ellipsis: true,
        minWidth: 3 * 15 + 36
      },
      {
        title: '创建时间',
        key: 'createTime',
        ellipsis: true,
        minWidth: 5 * 15 + 36,
        render: (h, params) =>
          h('span', date(params.row.createTime, 'yyyy-MM-dd hh:mm'))
      },
      {
        title: '备注信息',
        key: 'remarks',
        ellipsis: true,
        minWidth: 5 * 15 + 36
      },
      {
        title: '操作',
        key: 'action',
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (h, params) => this.renderOptions(h, params)
      }
    ];
    return {
      columns: _columns,
      searchParams: {},
      dataSource: {}
    };
  },
  methods: {
    init() {
      this.getList();
    },
    getList: debounce(function() {
      $http.postParams('v1/dict/dictPage', this.searchParams).then(data => {
        this.dataSource = data;
      });
    }),
    handleSearch() {
      this.searchParams.current = 1;
      this.getList();
    },
    handlePager(pager) {
      this.searchParams.current = pager.current;
      this.searchParams.size = pager.size;
      this.getList();
    },
    add() {
      this.$router.push({ name: 'dictEdit', params: { id: 'new' } });
    },
    edit(obj) {
      this.$router.push({ name: 'dictEdit', params: { id: obj.uid } });
    },
    del(obj) {
      $http
        .post('v1/dict/delete/' + obj.uid + '/' + obj.type)
        .then(data => this.getList());
    },
    renderOptions(h, params) {
      if (params.row.delFlag === '0') {
        return h('div', [
          h(
            'Poptip',
            {
              props: {
                confirm: true,
                title: '确定要禁用此条常用变量么?',
                transfer: true
              },
              on: {
                'on-ok': () => {
                  this.del(params.row);
                }
              }
            },
            [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '禁用'
              )
            ]
          )
        ]);
      } else {
        return h('div', [
          h(
            'Poptip',
            {
              props: {
                confirm: true,
                title: '确定要启用此条常用变量么?',
                transfer: true
              },
              on: {
                'on-ok': () => {
                  this.del(params.row);
                }
              }
            },
            [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '启用'
              )
            ]
          )
        ]);
      }
    }
  },
  components: { Pager },
  filters: { date },
  activated() {
    this.init();
  }
};
</script>

<style lang="less">
//.dict {}
</style>