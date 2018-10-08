<template>
  <div class="importantDeptList">
    <div class="topBar">
      <Input class="inputBox" search enter-button placeholder="Enter something..." />
      <div class="buttons">
        <Button type="info">Info</Button>
        <Button type="success">Success</Button>
        <Button type="warning">Warning</Button>
        <Button type="error">Error</Button>
      </div>
    </div>
    <div class="dataListBox">
      <Table border :columns="columns7" :data="data6"></Table>
      <div class="pagBox">
        <Page :total="40" size="small" show-elevator show-sizer show-total />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns7: [
        {
          title: 'Name',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ]);
          }
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                'View'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                'Delete'
              )
            ]);
          }
        }
      ],
      data6: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ]
    };
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${
          this.data6[index].age
        }<br>Address：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    }
  }
};
</script>
<style lang="less">
.importantDeptList {
  background: rgba(245, 247, 249, 1);
  .topBar {
    height: 50px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px 5px 0px 0px;
    box-shadow: 0px 0px 4px 0px rgba(182, 179, 176, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .buttons {
      margin-right: 10px;
      button {
        margin-left: 10px;
      }
    }
    .inputBox {
      width: 20%;
      margin-left: 10px;
    }
  }
  .dataListBox {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(182, 179, 176, 1);
    .pagBox {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
