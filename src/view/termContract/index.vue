<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by termContract id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newtermContract.show()
        }"
        >新增常規合約</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.edittermContract.show(record)
          }">更多</a>
      </template>
      <template slot="indContract" slot-scope="record">
        <a @click="()=>{
          $refs.individualContract.show(record.term_contract_id)
          }">額外合約</a>
      </template>
      <template slot="report" slot-scope="record">
        <a @click="()=>{
          $refs.regularReport.show(record.term_contract_id)
          }">提交檢查報告</a>
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
      this.getTableData(this.$route.params.bid);
      }" />
    <edittermContract ref="edittermContract" @done="()=>{
    this.getTableData(this.$route.params.bid);
    }" />
    <individualContract ref="individualContract" @done="()=>{
    this.getTableData(this.$route.params.bid);
    }" />
    <regularReport ref="regularReport" @done="()=>{
    this.getTableData(this.$route.params.bid);
    }" />
  </div>
</template>
<script>
import newtermContract from "./new";
import edittermContract from "./edit";
import individualContract from "./individualContract";
import regularReport from "./regularReport";
import { r_term_contract, d_term_contract } from "@/api/term_contract.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "常規合約編號", dataIndex: "term_contract_id", key: "term_contract_id" },
  { title: "常規合約種類", width: "150px", dataIndex: "type", key: "type" },
  { title: "合約期至", dataIndex: "contract_end_date", key: "contract_end_date" },
  { title: "合約週期", dataIndex: "job_period", key: "job_period" },
  { title: "N日後到期", dataIndex: "end_day_diff", key: "end_day_diff" },
  { title: "開工日期", dataIndex: "work_start_date", key: "work_start_date" },
  { title: "完工日期", dataIndex: "work_end_date", key: "work_end_date" },
  { title: "跟進人", dataIndex: "buyer_name_zh", key: "buyer_name_zh" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "120px", scopedSlots: { customRender: "report" } },
  { width: "120px", scopedSlots: { customRender: "indContract" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [
        {
          biding_price: "4",
          bt: "新界屯門海瑞路79號東華大樓14樓物業科",
          ccn: "佳定物業管理有限公司 ",
          ccp: "MS ABC",
          ce: "abc@tungwah.com",
          cen: "Guardian Property Management Limited ",
          cf: "98765413",
          client_data_id: "31",
          client_id: "29",
          csn: "c29",
          ct: "1234 5678",
          declare_number: "",
          end_bid_date: "2019-09-04",
          end_bid_time: "",
          end_date: "2019-08-21",
          in_price_date: "2019-08-29",
          is_bidding: "0",
          jca: "九龍大南街123號地下",
          lc: "大南街123號地下",
          le: "123 Tai Nan Street",
          lsn: "L00017",
          min_project: "0",
          out_price: "5",
          p_no: "19-c29-(BW)",
          pl: "short",
          pmaster_id: "41",
          project_area: "大南街123",
          pshort: "short",
          pt: "",
          re_bidding_date: "2019-08-27",
          regulation: "",
          sales_code: "(BW)",
          send_bid_date: "2019-08-15",
          send_bid_way: "",
          sort: "123",
          spn_date: "",
          start_date: "2019-08-01",
          sub_bid_name: "",
          sub_bid_number: "",
          sub_bid_price: "9",
          sub_price: "3",
          sub_price_name: "",
          sub_re_bid_date: "0000-00-00"
        }
      ],
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
  components: { newtermContract, edittermContract, regularReport, individualContract }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
