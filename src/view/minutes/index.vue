<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by minutes id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newMinutes.show(typeList)
        }"
        >新增會議紀錄</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editMinutes.show(record,typeList)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.minutes_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newMinutes ref="newMinutes" @done="()=>{
      this.getTableData();
      }" />
    <editMinutes ref="editMinutes" @done="()=>{
    this.getTableData();
    }" />
  </div>
</template>
<script>
import newMinutes from "./new";
import editMinutes from "./edit";
import { r_minutes, d_minutes } from "@/api/minutes.js";
import uuiddv1 from "uuid/v1";
import { get_minutes_type_select_options } from "./minutesUtils";
const columns = [
  { title: "會議紀錄編號", dataIndex: "minutes_id", key: "minutes_id" },
  { title: "會議紀錄種類", width: "150px", dataIndex: "type", key: "type" },
  { title: "第N屆", dataIndex: "oc_term", key: "oc_term" },
  { title: "第N次", dataIndex: "minutes_term", key: "minutes_term" },
  { title: "會議日期", dataIndex: "meeting_date", key: "meeting_date" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [],
      dataSource: [],
      typeList: [],
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
      this.tableData = dataSource.filter(item => item.minutes_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_minutes(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
          this.typeList = get_minutes_type_select_options();
          res.list.forEach(element => {
            if (!this.typeList.some(({ value }) => value === element.type)) {
              this.typeList.push({
                value: element.type,
                label: element.type
              });
            }
          });
        })
        .catch(err => {});
    },
    onDelete(minutes_id) {
      d_minutes(minutes_id)
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
  components: { newMinutes, editMinutes }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
