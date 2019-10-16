<template>
  <div>
    <p class="header">
      <a-input-search
        placeholder="search by Insurance Claims id"
        style="width: 200px"
        @search="onSearch"
      />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newInsuranceClaims.show(typeList)
        }"
        >新增保險索償</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.editInsuranceClaims.show(record,typeList)
          }">更多</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.insurance_claims_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newInsuranceClaims ref="newInsuranceClaims" @done="()=>{
      this.getTableData();
      }" />
    <editInsuranceClaims ref="editInsuranceClaims" @done="()=>{
    this.getTableData();
    }" />
  </div>
</template>
<script>
import newInsuranceClaims from "./new";
import editInsuranceClaims from "./edit";
import {
  r_insurance_claims,
  d_insurance_claims
} from "@/api/insurance_claims.js";
import uuiddv1 from "uuid/v1";
import { get_insurance_claims_type_select_options } from "./insuranceClaimsUtils";
//sort function added
var columns = [
  {
    title: "保險索償編號",
    dataIndex: "insurance_claims_id",
    filter: [
      { value: "已完成", text: "已完成" },
      { value: "待處理", text: "待處理" },
      { value: "進行中", text: "進行中" }
    ]
  },
  { title: "索償狀態", dataIndex: "status" },
  { title: "索償種類", dataIndex: "type" },
  {
    title: "事件發生日期",
    dataIndex: "event_date",
    sorter: (a, b) => new Date(b.event_date) - new Date(a.event_date)
  },
  { title: "相關單位", dataIndex: "unit" },
  { title: "理賠金額", dataIndex: "amount" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];

export default {
  data() {
    return {
      tableData: [],
      dataSource: [],
      typeList: [],
      typeListFilters: [],
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
        item => item.insurance_claims_id == val
      );
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    getTableData() {
      this.onTableLoading = true;
      r_insurance_claims(this.$route.params.bid)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
          this.typeList = get_insurance_claims_type_select_options();
          res.list.forEach(element => {
            if (!this.typeList.some(({ value }) => value === element.type)) {
              this.typeList.push({
                value: element.type,
                label: element.type
              });
            }
          });
          //filter function added
          this.typeListFilters = this.typeList.map(({ value, label }) => {
            return { value: value, text: label };
          });
          this.columns[2].filters = this.typeListFilters;
          this.columns[2].onFilter = (value, record) =>
            record.type.indexOf(value) === 0;
        })
        .catch(err => {});
    },
    onDelete(insurance_claims_id) {
      d_insurance_claims(insurance_claims_id)
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
  components: { newInsuranceClaims, editInsuranceClaims }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
