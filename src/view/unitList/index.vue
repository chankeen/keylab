<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by unitList id" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newunitList.show()
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
    <newunitList ref="newunitList" @done="()=>{
      this.getTableData(this.$route.params.bid);
      }" />
    <editunitList ref="editunitList" @done="()=>{
    this.getTableData(this.$route.params.bid);
    }" />
  </div>
</template>
<script>
import newunitList from "./new";
import editunitList from "./edit";
import { r_unit_list, d_unit_list } from "@/api/unit_list.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "單位編號", dataIndex: "unit_id", key: "unit_id" },
  { title: "單位層數", width: "150px", dataIndex: "floor", key: "floor" },
  { title: "單位號數", dataIndex: "unit", key: "unit" },
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
      this.tableData = dataSource.filter(item => item.unit_id == val);
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_unit_list(null)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
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
