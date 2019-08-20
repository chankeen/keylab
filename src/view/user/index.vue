<template>
  <div>
    <p class="header">
      <a-input-search placeholder="search by user name" style="width: 200px" @search="onSearch" />
      <span>
        <a-button
          type="primary"
          @click="()=>{
        this.$refs.newRecord.show()
        }"
        >Add Record</a-button>
      </span>
    </p>
    <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading" >
      <template slot="detail" slot-scope="record">
        <a @click="()=>{
          $router.push({name:'property_home',params:{bid:123}})
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
    <newRecord ref="newRecord" @done="()=>{
      this.getTableData();
      }" />
  </div>
</template>
<script>
import newRecord from "./new";
import { get_users } from "@/api/users.js";
import uuiddv1 from 'uuid/v1';
const columns = [
  { title: "User ID", dataIndex: "user_id" },
  { title: "Status",  dataIndex: "status"},
  { title: "Chinese Name", dataIndex: "name_zh"},
  { title: "English Name", dataIndex: "name_en"},
  { title: "Login Tel",width: "100px",  dataIndex: "login_tel"},
  { title: "Email", dataIndex: "login_tel"},
  { title: "Created By", dataIndex: "created_by"},
  { title: "Created Date",width: "100px",  dataIndex: "creation_datetime"},
  { scopedSlots: { customRender: "detail" } },
  { scopedSlots: { customRender: "delete" } }
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
  },
  methods: {
    onSearch(val) {
      const dataSource = [...this.dataSource];
      this.tableData = dataSource.filter(
        item =>
          (item.name_zh + item.name_en).toLowerCase().indexOf(val.toLowerCase()) > -1
      );
      if (val == "") {
        this.tableData = this.dataSource;
      }
    },
    //獲取表格數據
    getTableData() {
      this.onTableLoading = true;
      get_users()
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onDelete(cid) {
      delete_pmaster(cid)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    }
  },
  components: { newRecord }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
