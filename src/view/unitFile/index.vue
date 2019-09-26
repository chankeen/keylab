<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by unitFile id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newunitFile.show()
        }"
        >新增單位紀錄</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editunitFile.show(record)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.unit_file_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newunitFile
      ref="newunitFile"
      @done="()=>{
      this.getTableData(this.$route.params.bid);
      }"
    />
    <editunitFile
      ref="editunitFile"
      @done="()=>{
    this.getTableData(this.$route.params.bid);
    }"
    />
  </div>
</template>
<script>
import newunitFile from "./new";
import editunitFile from "./edit";
import { r_unit_file, d_unit_file } from "@/api/unit_file.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "單位紀錄編號", dataIndex: "unit_file_id", key: "unit_file_id" },
  { title: "單位編號", width: "150px", dataIndex: "unit_id", key: "unit_id" },
  { title: "紀錄種類", dataIndex: "type", key: "type" },
  { title: "文書日期", dataIndex: "instrument_date", key: "instrument_date" },
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
    this.getTableData(this.$route.params.bid);
  },
  methods: {
    onSearch(val) {
      const dataSource = [...this.dataSource];
      this.tableData = dataSource.filter(item => item.unit_file_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_unit_file(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(unit_file_id) {
      d_unit_file(unit_file_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newunitFile, editunitFile }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
