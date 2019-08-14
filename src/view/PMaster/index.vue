<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by client name" style="width: 200px" @search="onSearch" />
      <span>
        <a-dropdown @click="handleButtonClick">
          <a-button style="margin-left: 8px" type="primary">
            Create form
            <a-icon type="down" />
          </a-button>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item
              key="1"
              @click="()=>{
                this.$refs.createInvitationFile.show(tableData)
              }"
            >
              <a-icon type="file" />Create invitation for tender
            </a-menu-item>
            <a-menu-item
              key="2"
              @click="()=>{
                this.$refs.createQuotation.show(tableData)
              }"
            >
              <a-icon type="file" />Create quotation
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newPMaster.show()
        }"
        >Add Record</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.edit.show(record)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.pmaster_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newPMaster ref="newPMaster" @done="()=>{
      this.getTableData();
      }" />
    <createInvitationFile ref="createInvitationFile" />
    <createQuotation ref="createQuotation" />
    <edit ref="edit" @done="()=>{
      this.getTableData();
      }"></edit>
  </div>
</template>
<script>
import newPMaster from "./newPMaster";
import createInvitationFile from "./createInvitationFile";
import createQuotation from "./createQuotation";
import edit from "./edit";
import { get_pmasters, delete_pmaster } from "@/api/pmaster.js";
const columns = [
  { title: "排序", dataIndex: "sort", key: "name" },
  { title: "工程單編號", width: "150px", dataIndex: "p_no", key: "age" },
  { title: "工程地址短寫", dataIndex: "pshort", key: "address" },
  { title: "負責同事", dataIndex: "sales_code", key: "address" },
  { title: "客戶編碼", dataIndex: "csn", key: "address" },
  { title: "客戶", dataIndex: "ccn", key: "address" },
  { title: "工程地點", dataIndex: "pl", key: "address" },
  { title: "工程標題", dataIndex: "pt", key: "address" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }

  // { title: "被邀請報價日期", dataIndex: "name" },
  // { title: "截標日期", dataIndex: "name" },
  // { title: "截標時間", dataIndex: "name" },
  // { title: "交標日期", dataIndex: "name" },
  // { title: "交標方法", dataIndex: "name" },
  // { title: "出標價錢", dataIndex: "name" },
  // { title: "是否中標", dataIndex: "name" },
  // { title: "接收中標日期", dataIndex: "name" },
  // { title: "中標價錢", dataIndex: "name" },

  // { title: "報價分判名稱", dataIndex: "name" },
  // { title: "分判報價金額", dataIndex: "name" },
  // { title: "報價單編號或呈報日期", dataIndex: "name" },
  // { title: "中標分判名稱", dataIndex: "name" },
  // { title: "接收中標日期", dataIndex: "name" },
  // { title: "分判中標價錢", dataIndex: "name" },
  // { title: "分判中標編號", dataIndex: "name" },
  // { title: "開工日期", dataIndex: "name" },
  // { title: "完工日期", dataIndex: "name" },
  // { title: "是否需要小型工程", dataIndex: "name" },
  // { title: "申報記錄BW編號", dataIndex: "name" },
  // { title: "投標書付款條款", dataIndex: "name" },
  // { title: "SITE location", dataIndex: "name" },
  // { title: "BILL TO", dataIndex: "name" }
];
export default {
  data() {
    return {
      tableData: [],
      dataSource: [],
      columns,
      onTableLoading: false
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    onSearch(val) {
      const dataSource = [...this.dataSource];
      this.tableData = dataSource.filter(
        item =>
          (item.ccn + item.cen).toLowerCase().indexOf(val.toLowerCase()) > -1
      );
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      get_pmasters()
        .then(res => {
          this.onTableLoading = false;
          console.log(res.list);
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(cid) {
      delete_pmaster(cid)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newPMaster, edit, createInvitationFile, createQuotation }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
