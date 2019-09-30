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
            <span class="label">檢查日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.checking_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">檢查簡介</span>
            <a-input placeholder="請填寫簡介" v-model="info.subject"></a-input>
          </p>
          <p class="item">
            <span class="label">檢查報告檔案</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="regularReportFile" v-model="info.regular_report_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <a-input placeholder="請填寫備註" v-model="info.remarks"></a-input>
          </p>
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
      <a-divider />
      <contractReport ref="contractReport" v-model="regular_report_list" @delete="getTableData();"></contractReport>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import contractReport from "@/components/contractReport";
import uploadFile from "@/components/uploadFile.vue";
import {
  c_term_contract_regular_report,
  d_term_contract_regular_report,
  r_term_contract_regular_report,
  u_term_contract_regular_report
} from "@/api/term_contract_regular_report";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        checking_date: null,
        regular_report_file: [],
        remarks: ""
      },
      submit_info: {},
      regular_report_list: []
    };
  },
  components: { uploadFile, contractReport },
  created() {},
  methods: {
    show(term_contract_id) {
      //init data
      this.info.term_contract_id = term_contract_id;
      this.getTableData();
    },
    getTableData() {
      r_term_contract_regular_report(this.info.term_contract_id)
        .then(res => {
          //init data
          this.regular_report_list = res.list;
          this.info.checking_date = null;
          this.info.regular_report_file = [];
          this.info.remarks = "";
          //init status
          this.visible = true;
          this.onSubmiting = false;
        })
        .catch(err => {});
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      submit_info.regular_report_file = this.$refs.regularReportFile.get_file_info(
        submit_info.regular_report_file
      );
      if (submit_info.checking_date != null)
        submit_info.checking_date = submit_info.checking_date._isValid
          ? submit_info.checking_date.format("YYYY-MM-DD")
          : "";
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_term_contract_regular_report(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.getTableData();
          } else {
            this.$message.error("添加失敗 - api reponse - " + res.last_error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗 - server error ");
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

