<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by client name" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newRecord.show()
        }"
        >Add Record</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.edit.show(record)
          }">修改</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.oc_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newRecord ref="newRecord" @done="()=>{
      this.getTableData();
      }" />
    <edit ref="edit" @done="()=>{
      this.getTableData();
      }" />
  </div>
</template>
<script>
import newRecord from "./new";
import edit from "./edit";
import { r_oc, d_oc } from "@/api/oc.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "物業編號", dataIndex: "property_id" },
  { title: "名稱(中文)", dataIndex: "name_zh" },
  { title: "名稱(英文)", dataIndex: "name_en" },
  { title: "職位", dataIndex: "position" },
  { title: "Year From", dataIndex: "year_from" },
  { title: "Year To", dataIndex: "year_to" },
  { title: "Term", dataIndex: "term" },
  { title: "Elected Date", dataIndex: "elected_date" },
  { title: "Introduction", dataIndex: "introduction" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
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
      r_oc()
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(cid) {
      d_oc(cid)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newRecord, edit }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
