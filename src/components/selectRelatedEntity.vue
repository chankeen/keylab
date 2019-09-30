<template>
  <span>
    <a-modal title="Select Related Entity" v-model="visible" width="1000px" :footer="null">
      <h2>
        <a-input-search
          placeholder="search by name"
          style="width: 200px"
          @search="onSearch"
          v-model="search_text"
        />
        <a-button type="primary" @click="onReset">Reset</a-button>
      </h2>
      <a-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type:this.selectType
        }"
        :columns="columns"
        :rowKey="entity => entity.rowID"
        :dataSource="tableData"
      ></a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_oc } from "@/api/oc.js";
import { r_propman } from "@/api/propman.js";
import { r_contractor } from "@/api/contractor.js";

const columns = [
  { title: "類型", dataIndex: "display_type" },
  { title: "狀態", dataIndex: "status" },
  { title: "用戶中文名", dataIndex: "name_zh" },
  { title: "用戶英文名", dataIndex: "name_en" },
  { title: "電話號碼", dataIndex: "login_tel" }
];

export default {
  data() {
    return {
      tableData: [],
      columns,
      visible: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      context: "",
      search_text: "",
      dataSource: []
    };
  },
  props: ["selectType"],
  created() {},
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    getTableData(property_id) {
      this.loading = true;
      Promise.all([
        r_oc(property_id),
        r_propman(property_id),
        r_contractor(property_id)
      ])
        .then(res => {
          console.log(res);
          res.forEach((entity_list, index) => {
            console.log(entity_list);
            if (index == 0) {
              //oc
              entity_list.list.forEach(element => {
                let temp_obj = {};
                temp_obj.related_id = element.oc_id;
                temp_obj.type = "oc";
                temp_obj.display_type = "法團成員";
                temp_obj.name_zh = element.name_zh;
                temp_obj.name_en = element.name_en;
                temp_obj.login_tel = element.login_tel;
                temp_obj.rowID = this.dataSource.length;
                this.dataSource.push(temp_obj);
              });
            } else if (index == 1) {
              //propman
              entity_list.list.forEach(element => {
                let temp_obj = {};
                temp_obj.related_id = element.propman_id;
                temp_obj.type = "propman";
                temp_obj.display_type = "物管人員";
                temp_obj.name_zh = element.name_zh;
                temp_obj.name_en = element.name_en;
                temp_obj.login_tel = element.login_tel;
                temp_obj.rowID = this.dataSource.length;

                this.dataSource.push(temp_obj);
              });
            } else {
              //contractor
              entity_list.list.forEach(element => {
                let temp_obj = {};
                temp_obj.related_id = element.contractor_id;
                temp_obj.type = "contractor";
                temp_obj.display_type = "承辦商";
                temp_obj.name_zh = element.name_zh;
                temp_obj.name_en = element.name_en;
                temp_obj.login_tel = element.login_tel;
                temp_obj.rowID = this.dataSource.length;

                this.dataSource.push(temp_obj);
              });
            }
          });
          this.visible = true;
          this.context = this.context || "";
          this.selectedRowKeys = []; //clear select
          this.visible = true;
          this.search_text = "";
          this.tableData = this.dataSource;
          this.tableData = this.tableData.filter(
            item => !this.disabledEntityType.includes(item.type)
            //set these entity not show
          );
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    showModal(context, disabledEntityType = [], property_id) {
      this.context = context;
      this.disabledEntityType = disabledEntityType;
      this.dataSource = [];
      this.getTableData(property_id);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRows);
      this.selectedRowKeys = selectedRowKeys;
    },
    onSure() {
      this.visible = false;
      let list = {};
      this.dataSource.forEach(item => {
        if (this.selectedRowKeys[0] == item.rowID) {
          list = item;
        }
      });

      this.$emit("done", list);
    },
    onSearch(val) {
      if (val == "") {
        this.tableData = this.dataSource;
        return;
      }
      const dataSource = [...this.dataSource];
      let idList = new Set();
      dataSource.forEach(item => {
        if (
          item.name_zh.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.name_en.toLowerCase().indexOf(val.toLowerCase()) > -1
        ) {
          idList.add(item.name_zh);
        }
      });
      if (idList.length == 0) {
        this.tableData = this.dataSource;
      } else {
        this.tableData = [];
        idList.forEach(item => {
          dataSource.some(obj => {
            if (obj.name_zh == item) {
              this.tableData.push(obj);
              return true;
            }
          });
        });
      }
    },
    onReset(val) {
      this.search_text = "";
      this.tableData = this.dataSource;
    }
  }
};
</script>
