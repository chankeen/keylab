<template>
  <div>
    <p class="header">
      <a-input-search
        placeholder="用戶中文名 / 用戶英文名 / 電話 / 電郵"
        style="width: 600px"
        @search="onSearch"
      />
      <span>
        <a-button type="primary" @click="()=>{
        this.$refs.newRecord.show()
        }">新增用戶</a-button>
      </span>
    </p>
    <a-table
      :columns="columns"
      :rowKey="record => record.user_id"
      :dataSource="tableData"
      :loading="onTableLoading"
    >
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $refs.edit.show(record)
          }">修改</a>
      </template>
      <template slot="delete" slot-scope="record">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.user_id)"
        >
          <a>
            <a-icon type="delete"></a-icon>
          </a>
        </a-popconfirm>
      </template>
    </a-table>
    <newRecord ref="newRecord" @done="()=>{
      this.getTableData();
      }" />
    <edit ref="edit" @done="()=>{
      this.getTableData();
      }" />
  </div>
</template>
<script>
import newRecord from "./new";
import edit from "./edit";
import { r_users, d_users } from "@/api/users.js";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "User ID", dataIndex: "user_id" },
  { title: "Status", dataIndex: "status" },
  { title: "Type", dataIndex: "type" },
  { title: "Chinese Name", dataIndex: "name_zh" },
  { title: "English Name", dataIndex: "name_en" },
  { title: "Login Tel", dataIndex: "login_tel" },
  { title: "Email", dataIndex: "email" },
  { title: "Fax", dataIndex: "fax" },
  { scopedSlots: { customRender: "detail" } },
  { scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      tableData: [],
      dataSource: [],
      columns,
      onTableLoading: false,
      admin_wp_id: 0
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
          (item.name_zh + item.name_en + item.login_tel + item.email)
            .toLowerCase()
            .indexOf(val.toLowerCase()) > -1
      );
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    //獲取表格數據
    getTableData() {
      this.onTableLoading = true;
      r_users(sessionStorage.getItem("admin_wp_id"))
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(user_id) {
      d_users(user_id)
        .then(res => {
          console.log(res);
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
  components: { newRecord, edit }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
