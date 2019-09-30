<template>
  <div>
    <p class="header">
      <a-input-search
        placeholder="search by termContract id"
        style="width: 200px"
        @search="onSearch"
      />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newtermContract.show()
        }"
        >新增常規合約</a-button>
      </span>
    </p>
    <a-table
      :columns="columns"
      :dataSource="tableData"
      :loading="onTableLoading"
      :scroll="{x:'1500px'}"
    >
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.edittermContract.show(record)
          }">更多</a>
      </template>
      <template slot="indContract" slot-scope="record">
        <a
          @click="()=>{
          $refs.individualContract.show(record.term_contract_id)
          }"
        >額外合約</a>
      </template>
      <template slot="report" slot-scope="record">
        <a
          @click="()=>{
          $refs.regularReport.show(record.term_contract_id)
          }"
        >檢查報告</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.term_contract_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newtermContract
      ref="newtermContract"
      @done="()=>{
      this.getTableData(this.$route.params.bid);
      }"
    />
    <edittermContract
      ref="edittermContract"
      @done="()=>{
    this.getTableData(this.$route.params.bid);
    }"
    />
    <individualContract
      ref="individualContract"
      @done="()=>{
    this.getTableData(this.$route.params.bid);
    }"
    />
    <regularReport
      ref="regularReport"
      @done="()=>{
    this.getTableData(this.$route.params.bid);
    }"
    />
  </div>
</template>
<script>
import newtermContract from "./new";
import edittermContract from "./edit";
import individualContract from "./individualContract";
import regularReport from "./regularReport";
import { r_term_contract, d_term_contract } from "@/api/term_contract.js";
import { r_term_contract_related_entity } from "@/api/term_contract_related_entity";
import uuiddv1 from "uuid/v1";
const columns = [
  {
    width: "100px",
    title: "常規合約編號",
    dataIndex: "term_contract_id",
    key: "term_contract_id"
  },
  {
    width: "100px",
    title: "常規合約種類",
    width: "150px",
    dataIndex: "type",
    key: "type"
  },
  {
    width: "100px",
    title: "相關工程公司",
    width: "150px",
    dataIndex: "contractor_name_zh",
    key: "contractor_name_zh"
  },
  {
    width: "100px",
    title: "合約開結",
    dataIndex: "contract_end_date",
    key: "contract_start_date"
  },
  {
    width: "100px",
    title: "合約完結",
    dataIndex: "contract_end_date",
    key: "contract_end_date"
  },
  {
    width: "100px",
    title: "工作週期",
    dataIndex: "job_period",
    key: "job_period"
  },
  {
    width: "100px",
    title: "N日後到期",
    dataIndex: "end_day_diff",
    key: "end_day_diff"
  },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "120px", scopedSlots: { customRender: "report" } },
  { width: "120px", scopedSlots: { customRender: "indContract" } },
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
      this.tableData = dataSource.filter(item => item.term_contract_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_term_contract(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(term_contract_id) {
      d_term_contract(term_contract_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: {
    newtermContract,
    edittermContract,
    regularReport,
    individualContract
  }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
