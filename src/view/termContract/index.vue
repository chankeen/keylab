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
        this.$refs.newtermContract.show(typeList)
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
      <template
        slot="job_period_display"
        slot-scope="record"
      >{{job_period_display(record.job_period_unit,record.job_period_value)}}</template>
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.edittermContract.show(record,typeList)
          }">更多</a>
      </template>
      <!-- <template slot="indContract" slot-scope="record">
        <a
          @click="()=>{
          $refs.individualContract.show(record.term_contract_id)
          }"
        >額外合約</a>
      </template>-->
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
    <newtermContract ref="newtermContract" @done="()=>{
      this.getTableData();
      }" />
    <edittermContract ref="edittermContract" @done="()=>{
    this.getTableData();
    }" />
    <!-- <individualContract ref="individualContract" @done="()=>{
    this.getTableData();
    }" />-->
    <regularReport ref="regularReport" @done="()=>{
    this.getTableData();
    }" />
  </div>
</template>
<script>
import newtermContract from "./new";
import edittermContract from "./edit";
// import individualContract from "./individualContract";
import regularReport from "./regularReport";
import { r_term_contract, d_term_contract } from "@/api/term_contract.js";
import { r_term_contract_related_entity } from "@/api/term_contract_related_entity";
import uuiddv1 from "uuid/v1";
import { get_termContractType } from "./termContractUtil";
const columns = [
  {
    width: "100px",
    title: "常規合約編號",
    dataIndex: "term_contract_id"
  },
  {
    width: "100px",
    title: "常規合約狀態",
    dataIndex: "status"
  },
  {
    width: "100px",
    title: "常規合約種類",
    dataIndex: "type"
  },
  {
    width: "100px",
    title: "相關工程公司",
    dataIndex: "contractor_name_zh"
  },
  {
    width: "100px",
    title: "合約開結",
    dataIndex: "contract_start_date"
  },
  {
    width: "100px",
    title: "合約完結",
    dataIndex: "contract_end_date"
  },
  {
    width: "100px",
    title: "N日後到期",
    dataIndex: "end_day_diff"
  },
  {
    width: "100px",
    title: "工作週期",
    scopedSlots: { customRender: "job_period_display" }
  },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "report" } },
  // { width: "120px", scopedSlots: { customRender: "indContract" } },
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
          this.typeList = [];
          //get type from termContractUtil.js
          this.typeList = get_termContractType();
          //get current type from db
          this.tableData.forEach((list, index) => {
            if (!this.typeList.some(({ value }) => value === list.type)) {
              this.typeList.push({
                value: list.type,
                label: list.type
              });
            }
          });
          //add new type
          this.typeList.push({ value: "添加新種類", label: "添加新種類" });
        })
        .catch(err => {});
    },
    job_period_display(unit, value) {
      if (value == 0) {
        return "不適用";
      } else {
        return "每隔" + value + unit;
      }
    },
    onDelete(term_contract_id) {
      d_term_contract(term_contract_id)
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
  components: {
    newtermContract,
    edittermContract,
    regularReport
  }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
