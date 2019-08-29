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
            <a-input v-model="info.floor"></a-input>
          </p>
          <p class="item">
            <span class="label">檢查負責人</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label">檢查負責人公司</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label">是否需要額外工程合約</span>
            <a-checkbox v-model="info.check"></a-checkbox>
          </p>
          <p class="item">
          <span class="label">上載檢查報告檔案</span>
          <span style="text-align:left;width:100%">
            <uploadFile v-model="info.floor_plan_file"></uploadFile>
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
              }">更多</a>
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
      </a-row>
      
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import { u_unit_list } from "@/api/unit_list";
import uuiddv1 from "uuid/v1";
const columns = [
  { title: "檢查日期", dataIndex: "checking_date", key: "checking_date" },
  { title: "額外合約", dataIndex: "extra_contract", key: "extra_contract" },
  { title: "負責人", dataIndex: "buyer_name_zh", key: "buyer_name_zh" },
  { width: "100px", scopedSlots: { customRender: "detail" }},
  { width: "100px", scopedSlots: { customRender: "delete" }}
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
      var fake_obj = [{
        checking_date: "08/11/2018",
        extra_contract: "No",
        buyer_name_zh: "陳大文",
      }];
      this.tableData = fake_obj;
      this.dataSource = fake_obj;
    },
    onClose() {
      this.visible = false;
    },
    onSubmit() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          if (typeof this.info[key] == "object") {
            this.info[key] = this.info[key]._isValid
              ? this.info[key].format("YYYY-MM-DD")
              : "";
          }
        }
      }
      this.onSubmiting = true;
      u_unit_list(this.info)
        .then(res => {
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

