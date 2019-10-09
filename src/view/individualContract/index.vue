<template>
  <div>
    <p class="header">
      <a-input-search
        placeholder="search by individualContract id"
        style="width: 200px"
        @search="onSearch"
      />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newindividualContract.show(typeList,locationList)
        }"
        >新增一次性合約</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a
          @click="()=>{
          $refs.editindividualContract.show(record,typeList,locationList)
          }"
        >更多</a>
      </template>
      <template slot="report" slot-scope="record">
        <a
          @click="()=>{
          $refs.workReport.show(record.individual_contract_id)
          }"
        >工作報告</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.individual_contract_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newindividualContract
      ref="newindividualContract"
      @done="()=>{
      this.getTableData();
      }"
    />
    <workReport ref="workReport" @done="()=>{
      this.getTableData();
      }" />
    <editindividualContract
      ref="editindividualContract"
      @done="()=>{
    this.getTableData();
    }"
    />
  </div>
</template>
<script>
import newindividualContract from "./new";
import editindividualContract from "./edit";
import workReport from "./workReport";
import {
  r_individual_contract,
  d_individual_contract
} from "@/api/individual_contract.js";
import uuiddv1 from "uuid/v1";
const columns = [
  {
    title: "一次性合約編號",
    dataIndex: "individual_contract_id",
    key: "individual_contract_id"
  },
  {
    title: "一次性合約狀態",
    dataIndex: "status",
    key: "status"
  },
  { title: "一次性合約種類", width: "150px", dataIndex: "type", key: "type" },
  {
    width: "100px",
    title: "相關工程公司",
    dataIndex: "contractor_name_zh",
    key: "contractor_name_zh"
  },
  { title: "合約內容", dataIndex: "content", key: "content" },
  { title: "合約金額", dataIndex: "amount", key: "tender_amount" },
  { title: "施工地點", dataIndex: "location", key: "location" },
  { title: "保養狀況", dataIndex: "display_waranty", key: "waranty_period" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "120px", scopedSlots: { customRender: "report" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [{}],
      dataSource: [],
      typeList: [],
      locationList: [],
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
        item => item.individual_contract_id == val
      );
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_individual_contract(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
          //get type list and location list
          this.typeList = [];
          this.locationList = [];
          //get a list
          this.tableData.forEach((list, index) => {
            if (!this.typeList.some(({ value }) => value === list.type)) {
              this.typeList.push({
                value: list.type,
                label: list.type
              });
            }
            if (
              !this.locationList.some(({ value }) => value === list.location)
            ) {
              this.locationList.push({
                value: list.location,
                label: list.location
              });
            }
          });
        })
        .catch(err => {});
    },
    onDelete(individual_contract_id) {
      console.log(individual_contract_id);
      d_individual_contract(individual_contract_id)
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
  components: { newindividualContract, editindividualContract, workReport }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
