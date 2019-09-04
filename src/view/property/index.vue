<template>
  <div>
    <p class="header">
      <a-input-search placeholder="入物業名稱" style="width: 200px" @search="onSearch" />
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newProperty.show()
        }">新增物業</a-button>
      </span>
    </p>
    <a-table
      :rowKey="record => record.property_id"
      :columns="columns"
      :dataSource="tableData"
      :loading="onTableLoading"
    >
      <template slot="detail" slot-scope="record">
        <a
          @click="()=>{
          $router.push({name:'property_home',params:{bid:record.property_id,info:record},})
          }"
        >更多</a>
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
import { r_property, d_property } from "@/api/property.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "物業編號", dataIndex: "property_id" },
  { title: "物業種類", dataIndex: "type" },
  { title: "物業名稱(中文)", dataIndex: "name_zh" },
  { title: "物業名稱(英文)", dataIndex: "name_en" },
  { title: "地址(中文)", dataIndex: "address_zh" },
  { title: "地址(英文)", dataIndex: "address_en" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
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
    this.getTableData();
    console.log("admin_wp_id" + sessionStorage.getItem("admin_wp_id"));
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
      r_property(sessionStorage.getItem("admin_wp_id"), null)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(cid) {
      d_property(cid)
        .then(res => {
          if (res.status) {
            this.getTableData();
            this.$message.success("刪除成功");
          } else {
            this.$message.error("刪除失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
          this.$message.error("刪除失敗 - system error - " + err);
        });
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
