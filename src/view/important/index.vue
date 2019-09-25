<template>
  <div>
    <p class="header">
      <a-input-search placeholder="政府法令編號" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newImportant.show()
        }"
        >新增政府法令</a-button>
      </span>
    </p>
    <a-table
      :rowKey="record => record.important_id"
      :columns="columns"
      :dataSource="tableData"
      :loading="onTableLoading"
    >
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editImportant.show(record)
          }">更多</a>
      </template>
      <template slot="extend" slot-scope="record">
        <a @click="()=>{
          $refs.extendDeadline.show(record.important_id)
          }">延長期限</a>
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
    <extendDeadline ref="extendDeadline" @done="()=>{
    this.getTableData();
    }" />
  </div>
</template>
<script>
import newImportant from "./new";
import editImportant from "./edit";
import extendDeadline from "./extendDeadline";
import { r_important, d_important } from "@/api/important.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "政府法令編號", dataIndex: "important_id" },
  { title: "政府法令種類", width: "150px", dataIndex: "type" },
  { title: "政府法令內容", dataIndex: "content" },
  { title: "知悉日期", dataIndex: "known_date" },
  { title: "處理限期(最新)", dataIndex: "latest_deadline" },
  { title: "n日後到期", dataIndex: "date_left" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "extend" } },
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
      r_important(this.$route.params.bid)
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
            this.$message.success("成功刪除");
          } else {
            this.$message.error("刪除失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
          this.$message.error("刪除失敗 - system error - " + err);
        });
    }
  },
  components: { newImportant, editImportant, extendDeadline }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
