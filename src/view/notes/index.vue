<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by notes id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newnotes.show()
        }">新增雜項</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editnotes.show(record)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.note_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newnotes ref="newnotes" @done="()=>{
      this.getTableData();
      }" />
    <editnotes ref="editnotes" @done="()=>{
    this.getTableData();
    }" />
  </div>
</template>
<script>
import newnotes from "./new";
import editnotes from "./edit";
import { r_notes, d_notes } from "@/api/notes.js";
import uuiddv1 from "uuid/v1";
//sort function added
var columns = [
  { title: "雜項編號", dataIndex: "note_id" },
  { title: "標題", dataIndex: "title" },
  { title: "建立日期", dataIndex: "creation_timestamp" },
  { title: "更新日期", dataIndex: "last_update_timestamp" },
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
      this.tableData = dataSource.filter(item => item.note_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_notes(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(note_id) {
      d_notes(note_id)
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
  components: { newnotes, editnotes }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
