<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by unitList id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newunitList.show(blockList)
        }"
        >新增單位</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editunitList.show(record)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.unit_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newunitList
      ref="newunitList"
      @done="()=>{
      this.getTableData(this.$route.params.bid);
      }"
    />
    <editunitList
      ref="editunitList"
      @done="()=>{
    this.getTableData(this.$route.params.bid);
    }"
    />
  </div>
</template>
<script>
import newunitList from "./new";
import editunitList from "./edit";
import { r_unit_list, d_unit_list } from "@/api/unit_list.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "單位編號", dataIndex: "unit_id", key: "unit_id" },
  { title: "座數", dataIndex: "block", key: "block" },
  { title: "單位層數", dataIndex: "floor", key: "floor" },
  { title: "單位號數", dataIndex: "unit", key: "unit" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [],
      dataSource: [],
      blockList: [],
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
      this.tableData = dataSource.filter(item => item.unit_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_unit_list(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
          //get block list
          this.tableData.forEach((unitlist, index) => {
            if (!this.blockList.includes(unitlist.block))
              this.blockList.push({
                value: unitlist.block,
                label: unitlist.block
              });
          });
        })
        .catch(err => {});
    },
    onDelete(unit_id) {
      d_unit_list(unit_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newunitList, editunitList }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
