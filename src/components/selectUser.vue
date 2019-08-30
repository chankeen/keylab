<template>
  <span>
    <a-modal title="Select User" v-model="visible" width="1000px" :footer="null">
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
          type: this.selectType
        }"
        :columns="columns"
        :dataSource="tableData"
      ></a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_users } from "@/api/users.js";
const columns = [
  { title: "User ID", dataIndex: "id" },
  { title: "Status", dataIndex: "status" },
  { title: "Chinese Name", dataIndex: "name_zh" },
  { title: "English Name", dataIndex: "name_en" },
  { title: "Created By", dataIndex: "created_by" }
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
  created() {
    this.getTableData();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    getTableData() {
      this.loading = true;
      r_users(sessionStorage.getItem("admin_wp_id"))
        .then(res => {
          res.list.forEach(item => {
            this.$set(item, "id", parseInt(item.user_id));
          });
          this.tableData = res.list;
          this.dataSource = this.tableData;

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    showModal(context, disabledEntityList = []) {
      this.context = context || "";
      this.selectedRowKeys = []; //clear select
      this.visible = true;
      this.search_text = "";
      this.tableData = this.dataSource;
      this.tableData = this.tableData.filter(
        item => !disabledEntityList.includes(item.id)
        //set these entity not show
      );
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSure() {
      this.visible = false;
      let list = {};
      let idList = [];
      this.selectedRowKeys.forEach(item => {
        list[this.dataSource[item].id] = this.dataSource[item];
        idList.push(this.dataSource[item].id);
      });

      this.$emit("done", {
        context: this.context,
        selectedRowKeys: idList,
        list
      });
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
          idList.add(item.user_id);
        }
      });
      if (idList.length == 0) {
        this.tableData = this.dataSource;
      } else {
        this.tableData = [];
        idList.forEach(item => {
          dataSource.some(obj => {
            if (obj.user_id == item) {
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
