<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by property name" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newProperty.show()
        }"
        >Add Property</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $router.push({name:'property_home',params:{bid:123,info:record},})
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.property_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newProperty ref="newProperty" @done="()=>{
      this.getTableData();
      }" />
  </div>
</template>
<script>
import newProperty from "./newProperty";
import { get_property, delete_property } from "@/api/property.js";
import uuiddv1 from 'uuid/v1';
const columns = [
  { title: "物業編號", dataIndex: "property_id", key: "property_id" },
  { title: "物業種類", width: "150px", dataIndex: "type", key: "type" },
  { title: "物業名稱(中文)", dataIndex: "name_zh", key: "name_zh" },
  { title: "物業名稱(英文)", dataIndex: "name_en", key: "name_en" },
  { title: "地址(中文)", dataIndex: "address_zh", key: "address_zh" },
  { title: "地址(英文)", dataIndex: "address_en", key: "address_en" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [{biding_price: "4",
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
                  sub_re_bid_date: "0000-00-00",
}],
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
        item =>
          (item.ccn + item.cen).toLowerCase().indexOf(val.toLowerCase()) > -1
      );
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      get_property()
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(cid) {
      delete_property(cid)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newProperty }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
