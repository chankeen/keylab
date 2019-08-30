<template>
  <a-drawer
    title="定期報告"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="600px"
  >
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">相關定期合約編號</span>
            <a-input v-model="info.term_contract_id"></a-input>
          </p>
          <p class="item">
            <span class="label">檢查日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.checking_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">檢查種類</span>
            <a-select v-model="info.type">
              <a-select-option value="冷氣">冷氣</a-select-option>
              <a-select-option value="電梯">電梯</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">檢查負責人</span>
            <a-input v-model="info.handler"></a-input>
          </p>
          <p class="item">
            <span class="label">是否需要額外工程合約</span>
            <a-select v-model="info.extra_contract">
              <a-select-option value="否">否</a-select-option>
              <a-select-option value="是">是</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">上載檢查報告檔案</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.regular_report_file"></uploadFile>
            </span>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>

      <a-row>
        <a-table :columns="columns" :dataSource="tableData" :loading="onTableLoading">
          <template slot="detail" slot-scope="record">
            <a @click="()=>{
              $refs.edittermContract.show(record)
              }">建立合約</a>
          </template>
          <template slot="delete" slot-scope="record">
            <a-popconfirm
              v-if="tableData.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record.regular_report_id)"
            >
              <a>
                <a-icon type="delete"></a-icon>
              </a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-row>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import {
  c_regular_report,
  d_regular_report,
  r_regular_report,
  u_regular_report
} from "@/api/regular_report";

import uuiddv1 from "uuid/v1";
const columns = [
  { title: "檢查日期", dataIndex: "checking_date", key: "checking_date" },
  { title: "額外合約", dataIndex: "extra_contract", key: "extra_contract" },
  { title: "負責人", dataIndex: "handler", key: "handler" },
  { width: "100px", scopedSlots: { customRender: "detail" } },
  { width: "100px", scopedSlots: { customRender: "delete" } }
];
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {},
      dataSource: [],
      columns,
      onTableLoading: false
    };
  },
  components: { uploadFile },
  created() {
    this.getTableData();
  },
  methods: {
    show(term_contract_id) {
      this.visible = true;
      this.onSubmiting = false;
      this.info.term_contract_id = term_contract_id;
    },
    getTableData() {
      this.onTableLoading = true;
      this.onTableLoading = false;
      r_regular_report(this.info.term_contract_id)
        .then(res => {
          this.onTableLoading = false;
          this.tableData = res.list;
          this.dataSource = res.list;
        })
        .catch(err => {});
    },
    onClose() {
      this.visible = false;
    },
    get_file_info(item) {
      //get info of file
      item.forEach(value => {
        for (var key in value) {
          if (
            key == "name" ||
            key == "url" ||
            key == "uid" ||
            key == "status"
          ) {
            continue;
          }
          delete value[key];
        }
      });
      return item;
    },
    onDelete(regular_report_id) {
      d_regular_report(regular_report_id)
        .then(res => {
          if (res.status) {
            this.getTableData();
          } else {
          }
        })
        .catch(err => {});
    },
    onSubmit() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          if (
            typeof this.info[key] == "object" &&
            !Array.isArray(this.info[key])
          ) {
            this.info[key] = this.info[key]._isValid
              ? this.info[key].format("YYYY-MM-DD")
              : "";
          }
        }
      }
      this.info.regular_report_file = this.get_file_info(
        this.info.regular_report_file
      );
      this.onSubmiting = true;
      c_regular_report(this.info)
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗");
        });
      this.getTableData();
    }
  }
};
</script>
<style lang="scss">
.new-pmaster-modal {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      min-width: 160px;
    }
    .ant-calendar-picker {
      width: 100%;
    }
  }
  .ant-select {
    width: 100%;
  }
}
</style>

