<template>
  <section class="formList paper">
      <span class="title">
              <span>{{$i('sys-sys_code')}}</span>
      </span>
      <el-row  type="flex" :gutter="20">
          <el-col :span="18">
              <el-input size="medium" v-model="store.postData.tableName" :placeholder="$i('sys-sys_code-name')" @keyup.native.13="search"></el-input>
              <el-button class="click-ripple" type="primary" @click="getDataList">{{$i("cooco_public_button_search")}}</el-button>
          </el-col>
          <el-col class="cont-right" :span="4" :offset="2">
              <el-button class="click-ripple" type="primary" title="将代码生成zip包下载" @click="getCode">{{$i("sys-sys_code-generate")}}</el-button>
              <el-button class="click-ripple" type="primary" title="直接把代码生成到配置的磁盘路径下" @click="getCodeDirect">{{$i("sys-sys_code-direct")}}</el-button>
              <el-button class="click-ripple" type="primary" @click="getSetting">{{$i("sys-sys_code-config")}}</el-button>
          </el-col>
      </el-row>
      <el-table :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange" height="600">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name" :label="$i('sys-sys_code-name')"></el-table-column>
          <el-table-column prop="comment" :label="$i('sys-sys_code-explain')"></el-table-column>
          <!-- <el-table-column prop="control" label="操作">
            <template slot-scope="scope">
              <el-button class="click-ripple" size="small" @click="getTableSetting(scope.row.name)">编辑</el-button>
            </template>
          </el-table-column> -->
      </el-table>

      <el-dialog :title="$i('sys-sys_code-config')" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form :model="settingform" :inline="true" class="demo-form-inline">
              <el-form-item :label="$i('sys-sys_code-springboard-path')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.controllerLocalPath" auto-complete="off"></el-input>
                 <div class="tips">如 D:\xxx\javaSrc\xxx-portal (controller层)</div>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-interface-path')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.apiLocalPath" auto-complete="off"></el-input>
                <div class="tips">如 D:\xxx\javaSrc\xxx-business-xxx-api （api层）</div>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-implement-path')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.implLocalPath" auto-complete="off"></el-input>
                <div class="tips">如 D:\xxx\javaSrc\xxx-business-xxx-impl （service实现层）</div>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-front-path')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.frontLocalPath" auto-complete="off"></el-input>
                <div class="tips">如 D:\xxx\javaSrc\xxx-mgr （web页面层）</div>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-model-name')" :label-width="formLabelWidth">
                <el-input v-model="settingform.modelName" auto-complete="off"></el-input>
                <div class="tips">业务模块 如 book </div>
              </el-form-item>
              <el-form-item label="ip" :label-width="formLabelWidth">
                  <el-input v-model="settingform.ip" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-port')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.port" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-databasename')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.database" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-username')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.username" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-pwd')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.password" auto-complete="off" type="password"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-dbadriver')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.driver" auto-complete="off"></el-input>
              </el-form-item>
          </el-form>
          <el-form :model="settingform" :inline="true" class="demo-form-inline">
              <el-form-item :label="$i('sys-sys_code-allowed')" :label-width="formLabelWidth">
                  <el-checkbox v-model="settingform.allowMultiQueries" name="sql"></el-checkbox>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-gbk')" :label-width="formLabelWidth">
                  <el-checkbox v-model="settingform.useUnicode" name="GBK"></el-checkbox>
              </el-form-item>
          </el-form>
          <el-form :model="settingform" :inline="true" class="demo-form-inline">
              <el-form-item :label="$i('sys-sys_code-method')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.characterEncoding"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-date')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.zeroDateTimeBehavior"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-method')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.packageName"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-author')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.author"></el-input>
              </el-form-item>
              <el-form-item :label="$i('sys-sys_code-email')" :label-width="formLabelWidth">
                  <el-input v-model="settingform.email"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button class="click-ripple" type="danger" @click="dialogFormVisible = false">{{$i("cooco_public_button_cancel")}}</el-button>
              <el-button class="click-ripple" type="primary" @click="saveSetting">{{$i("cooco_public_button_save")}}</el-button>
          </div>
    </el-dialog>

	<!-- <el-dialog :visible.sync="dialogTableVisble" :close-on-click-modal="false">
		<label slot="title">{{ '编辑 ' + settingTable.name }}</label>
		<el-form :model="settingTable" :inline="true">
			<el-form-item label="表名" :label-width="formLabelWidth">
				<span>{{ settingTable.name }}</span>
			</el-form-item>
			<el-form-item label="说明" :label-width="formLabelWidth">
				<span>{{ settingTable.comment }}</span>
			</el-form-item>
		</el-form>

		<el-button class="click-ripple" size="small" @click="showPageSetting(1)">页面属性</el-button>
		<el-button class="click-ripple" size="small" @click="showPageSetting(0)">页面校验</el-button>

		<el-table height="250" :data="setTableTabContent" border tooltip-effect="dark">
	        <el-table-column prop="name" label="列名"></el-table-column>
	        <el-table-column prop="comment" label="说明"></el-table-column>
	        <template v-if="pagePropVisble">
		        <el-table-column prop="formShow" label="表单">
		      		<template slot-scope="scope">
		      			<el-checkbox v-model="scope.row.columnConfig.formShow" name="formShow"></el-checkbox>
		      		</template>
		        </el-table-column>
		        <el-table-column prop="listShow" label="列表">
		      		<template slot-scope="scope">
		      			<el-checkbox v-model="scope.row.columnConfig.listShow" name="listShow"></el-checkbox>
		      		</template>
		        </el-table-column>
		        <el-table-column prop="searchShow" label="查询">
		      		<template slot-scope="scope">
		      			<el-checkbox v-model="scope.row.columnConfig.searchShow" name="searchShow"></el-checkbox>
		      		</template>
		        </el-table-column>
	        </template>
	        <template v-else>
		        <el-table-column prop="validateType" label="校验类型">
		      		<template slot-scope="scope">
						<el-select v-model="scope.row.columnConfig.validateType" placeholder="校验类型">
							<el-option label="" value=""></el-option>
							<el-option label="string" value="string"></el-option>
							<el-option label="number" value="number"></el-option>
							<el-option label="date" value="date"></el-option>
							<el-option label="url" value="url"></el-option>
							<el-option label="float" value="float"></el-option>
							<el-option label="email" value="email"></el-option>
							<el-option label="phone" value="phone"></el-option>
						</el-select>
		        	</template>
		        </el-table-column>
	        </template>
	    </el-table>

		<div slot="footer" class="dialog-footer">
			<el-button class="click-ripple" type="danger" @click="dialogTableVisble = false">关 闭</el-button>
			<el-button class="click-ripple" type="primary" @click="saveTableSetting">保 存</el-button>
		</div>

	</el-dialog> -->

  </section>
</template>

<script>
	import { $get, $post } from '@/frame/utils/http'
	export default {
	    computed: {

	    },
	    data() {
	        return {
	            dialogFormVisible: false,
	            // dialogTableVisble: false,
							pagePropVisble: true,
							store: this.$store.state.GenerateCode,
	            formLabelWidth: '120px',
	            settingform: {},
	            tableData: [],
	            buildTable: {
                  tableNames: ''
	            },
	            settingTable: {},
	            setTableTab: [
                  {
                    name: 'pageProp',
                    title: '页面属性'
                  },
                  {
                    name: 'pageCheck',
                    title: '页面校验'
                  }
              ],
              setTableTabContent: []
	        }
	    },
	    methods: {
	        getDataList() {
              if (this.store.postData.tableName == null || this.store.postData.tableName === '') {
                  $get('code/tablelist')
                      .then((res) => {
                          this.tableData = res.data.tableList
                                })
              } else {
                  $get('code/tablelistByName', { tableName: this.store.postData.tableName })
                      .then((res) => {
                          this.tableData = res.data.tableList
                      })
              }
	        },
	        getCode() {
	            if (!this.buildTable.tableNames) {
	                alert('请选择表生成代码')
                  return
              }
	            // 提取代码
	            window.location.href = 'code/build?tableNames=' + this.buildTable.tableNames
	        },
          getCodeDirect() {
	            if (!this.settingform.controllerLocalPath || this.settingform.controllerLocalPath === '') {
	                alert(this.$i('sys-sys_code-springboard-path') + this.$i('cooco_public_rules_notnull'))
                  return
              }
              if (!this.settingform.apiLocalPath || this.settingform.apiLocalPath === '') {
                  alert(this.$i('sys-sys_code-interface-path') + this.$i('cooco_public_rules_notnull'))
                  return
              }
              if (!this.settingform.implLocalPath || this.settingform.implLocalPath === '') {
                  alert(this.$i('sys-sys_code-implement-path') + this.$i('cooco_public_rules_notnull'))
                  return
              }
              if (!this.settingform.frontLocalPath || this.settingform.frontLocalPath === '') {
                  alert(this.$i('sys-sys_code-front-path') + this.$i('cooco_public_rules_notnull'))
                  return
              }
              // 直接生成代码至本地
              $get('code/buildDirect?tableNames=' + this.buildTable.tableNames)
                  .then((res) => {
                      if (res.data.code === 0) {
                          alert('生成代码成功，确定将刷新页面')
                          window.location.reload()
                      } else {
                          alert('生成代码失败')
                      }
                  })

//              window.location.href = 'code/buildDirect?tableNames=' + this.buildTable.tableNames
          },
	        getSetting() {
              // 打开数据库配置
              this.dialogFormVisible = true
	        },
	        saveSetting() {
              // 保存数据库配置
              $post('code/config/save', this.settingform)
                  .then(() => {
                      this.dialogFormVisible = false
                  })
	        },
	        /* getTableSetting(name) {
				// 打开表信息设置
				this.dialogTableVisble = true
				$get('/code/config/getTable', { tableName: name })
					.then((res) => {
						// console.log(res.data)
						this.settingTable = res.data.table
						this.setTableTabContent = res.data.table.columnList
						// console.table(this.setTableTabContent)
					})
	        },*/
	        showPageSetting(type) {
              if (type) {
                this.pagePropVisble = true
              } else {
                this.pagePropVisble = false
              }
          },
	        saveTableSetting() {
              // 保存表信息设置
              $post('code/config/saveTableConfig', this.settingTable)
                  .then(() => {
                      this.dialogTableVisble = false
                  })
	        },
          handleSelectionChange(val) {
              this.buildTable.tableNames = ''
              for (var key in val) {
                  this.buildTable.tableNames += (val[key].name + ',')
              }
              this.buildTable.tableNames = this.buildTable.tableNames.slice(0, -1)
          }
	    },
	    mounted() {
        $get('code/config/get')
          .then((res) => {
            this.settingform = res.data.config
          })
	    },
	    components: {
	    },
	    filters: {
	        statusFilter(value) {
	            return value === 0 ? '是' : '否'
	        }
	    }
	}
</script>
