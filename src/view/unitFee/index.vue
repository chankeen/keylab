<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by unitFee id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newunitFee.show()
        }"
        >新增管理費</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editunitFee.show(record)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.unit_fee_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newunitFee ref="newunitFee" @done="()=>{
      this.getTableData(this.$route.params.bid);
      }" />
    <editunitFee ref="editunitFee" @done="()=>{
    this.getTableData(this.$route.params.bid);
    }" />
  </div>
</template>
<script>
import newunitFee from "./new";
import editunitFee from "./edit";
import { r_unit_fee, d_unit_fee } from "@/api/unit_fee.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "管理費編號", dataIndex: "unit_fee_id", key: "unit_fee_id" },
  { title: "單位編號", width: "150px", dataIndex: "unit_id", key: "unit_id" },
  { title: "收費種類", dataIndex: "type", key: "type" },
  { title: "金額", dataIndex: "amount", key: "amount" },
  { title: "繳付狀態", dataIndex: "payment_status", key: "payment_status" },
  { title: "繳付方法", dataIndex: "payment_type", key: "payment_type" },
  { title: "收款日期", dataIndex: "receive_date", key: "receive_date" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
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
      this.tableData = dataSource.filter(item => item.unit_fee_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_unit_fee(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(unit_fee_id) {
      d_unit_fee(unit_fee_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newunitFee, editunitFee }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
