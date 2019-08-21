<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by minutes id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newMinutes.show()
        }"
        >新增會議紀錄</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editMinutes.show(record)
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
      this.getTableData(this.$route.params.bid);
      }" />
    <editMinutes ref="editMinutes" @done="()=>{
    this.getTableData(this.$route.params.bid);
    }" />
  </div>
</template>
<script>
import newMinutes from "./new";
import editMinutes from "./edit";
import { r_minutes, d_minutes } from "@/api/minutes.js";
import uuiddv1 from "uuid/v1";
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
      this.tableData = dataSource.filter(item => item.minutes_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData(property_id) {
      this.onTableLoading = true;
      r_minutes(property_id)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(minutes_id) {
      d_minutes(minutes_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
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
