<template>
  <a-drawer
    title="工程報告"
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
            <span class="label required">開工日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.work_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">工程簡介</span>
            <a-input placeholder="請填寫簡介" v-model="info.subject"></a-input>
          </p>
          <p class="item">
            <span class="label">工程進度報告檔案</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="workReportFile" v-model="info.file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <a-input placeholder="請填寫備註" v-model="info.remarks"></a-input>
          </p>
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
      <a-divider />
      <contractReport
        :contractid="info.individual_contract_id"
        :contracttype="'individual'"
        ref="contractReport"
        v-model="work_report_list"
        @delete="getTableData"
      ></contractReport>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import contractReport from "@/components/contractReport";
import uploadFile from "@/components/uploadFile.vue";
import {
  c_individual_contract_work_report,
  d_individual_contract_work_report,
  r_individual_contract_work_report,
  u_individual_contract_work_report
} from "@/api/individual_contract_work_report";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        subject: "",
        work_date: null,
        file: [],
        remarks: ""
      },
      submit_info: {},
      work_report_list: []
    };
  },
  components: { uploadFile, contractReport },
  created() {},
  methods: {
    show(individual_contract_id) {
      //init data
      this.info.individual_contract_id = individual_contract_id;
      this.getTableData();
    },
    getTableData() {
      r_individual_contract_work_report(this.info.individual_contract_id)
        .then(res => {
          //init data
          this.work_report_list = res.list.map(item => ({
            id: item.work_report_id,
            subject: item.subject,
            date: item.work_date,
            remarks: item.remarks,
            file: item.file
          }));
          this.info.work_date = null;
          this.info.file = [];
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
      submit_info.file = this.$refs.workReportFile.get_file_info(
        submit_info.file
      );
      if (submit_info.work_date != null)
        submit_info.work_date = submit_info.work_date._isValid
          ? submit_info.work_date.format("YYYY-MM-DD")
          : "";
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["work_date"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (this.info[mandatory_property[i]] == null) {
            this.$message.error("請檢查必須填寫的資料");
            return false;
          }
        } else {
          this.$message.error("mandatory status wrong");
          return false;
        }
      }
      return this.onSubmit();
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_individual_contract_work_report(
        this.handle_submit_data(this.submit_info)
      )
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.getTableData();
          } else {
            this.$message.error("添加失敗 - api reponse - " + res.error);
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

