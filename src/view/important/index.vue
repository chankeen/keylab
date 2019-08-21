<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by important id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newImportant.show()
        }"
        >新增重要事項</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editImportant.show(record)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.important_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newImportant ref="newImportant" @done="()=>{
      this.getTableData();
      }" />
    <editImportant ref="editImportant" @done="()=>{
    this.getTableData();
    }" />
  </div>
</template>
<script>
import newImportant from "./new";
import editImportant from "./edit";
import { r_important, d_important } from "@/api/important.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "重要事項編號", dataIndex: "important_id", key: "important_id" },
  { title: "重要事項種類", width: "150px", dataIndex: "type", key: "type" },
  { title: "重要事項內容", dataIndex: "content", key: "content" },
  { title: "知悉日期", dataIndex: "known_date", key: "known_date" },
  { title: "處理死線", dataIndex: "deadline", key: "deadline" },
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
      this.tableData = dataSource.filter(item => item.important_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_important(null)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(important_id) {
      d_important(important_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newImportant, editImportant }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
