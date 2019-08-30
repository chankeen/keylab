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
        this.$refs.newindividualContract.show()
        }"
        >新增常規合約</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editindividualContract.show(record)
          }">更多</a>
      </template>
      <template slot="indContract" slot-scope="record">
        <a
          @click="()=>{
          $refs.individualContract.show(record.individual_contract_id)
          }"
        >額外合約</a>
      </template>
      <template slot="report" slot-scope="record">
        <a
          @click="()=>{
          $refs.regularReport.show(record.individual_contract_id)
          }"
        >提交檢查報告</a>
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
      this.getTableData(this.$route.params.bid);
      }"
    />
    <editindividualContract
      ref="editindividualContract"
      @done="()=>{
    this.getTableData(this.$route.params.bid);
    }"
    />
  </div>
</template>
<script>
import newindividualContract from "./new";
import editindividualContract from "./edit";
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
  { title: "一次性合約種類", width: "150px", dataIndex: "type", key: "type" },
  { title: "合約狀態", dataIndex: "status", key: "status" },
  { title: "合約內容", dataIndex: "content", key: "content" },
  { title: "合約金額", dataIndex: "tender_amount", key: "tender_amount" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [{}],
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
        })
        .catch(err => {});
    },
    onDelete(individual_contract_id) {
      console.log(individual_contract_id);
      d_individual_contract(individual_contract_id)
        .then(res => {
          console.log(res);
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newindividualContract, editindividualContract }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
