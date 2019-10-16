<template>
  <a-drawer
    title="修改/檢視保險索償"
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
            <span class="label required">保險索償狀態</span>
            <a-select v-model="info.status">
              <a-select-option value="待處理">待處理</a-select-option>
              <a-select-option value="處理中">處理中</a-select-option>
              <a-select-option value="已完成">已完成</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">保險索償種類</span>
            <a-select :options="typeOptions" v-model="info.type"></a-select>
          </p>
          <p class="item" v-if="info.type == '添加新種類'">
            <span class="label required">輸入新種類</span>
            <a-input v-model="info.new_type"></a-input>
          </p>
          <p class="item">
            <span class="label required">事件發生日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.event_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">相關單位</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label">理賠金額</span>
            <a-input v-model="info.amount"></a-input>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <tinymce-editor
              api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
              v-model="info.remarks"
              style="width:100%"
              :init="{plugins: 'wordcount'}"
            ></tinymce-editor>
          </p>
          <a-divider />
          <p class="item">
            <span class="label">報價文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="quotationFile" v-model="info.quotation_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">公正行文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="adjusterFile" v-model="info.adjuster_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">保險理賠文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="insuranceFile" v-model="info.insurance_file"></uploadFile>
            </span>
          </p>
          <a-divider />
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import Editor from "@tinymce/tinymce-vue";
import uploadFile from "@/components/uploadFile.vue";
import { u_insurance_claims } from "@/api/insurance_claims";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      typeOptions: [],
      submit_info: {},
      info: {}
    };
  },
  components: { uploadFile, "tinymce-editor": Editor },
  created() {},
  methods: {
    show(info, typeList) {
      this.info = JSON.parse(JSON.stringify(info));
      if (this.info.event_date == "0000-00-00") {
        this.info.event_date = null;
      } else {
        this.info.event_date = moment(this.info.event_date, "YYYY-MM-DD");
      }

      if (this.info.quotation_file == null || this.info.quotation_file == "") {
        this.info.quotation_file = [];
      }
      if (this.info.adjuster_file == null || this.info.adjuster_file == "") {
        this.info.adjuster_file = [];
      }
      if (this.info.insurance_file == null || this.info.insurance_file == "") {
        this.info.insurance_file = [];
      }

      Object.assign(this.typeOptions, typeList);
      this.typeOptions.push({ value: "添加新種類", label: "添加新種類" });

      this.$set(this.info, "new_type", "");
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.typeOptions = [];
      this.visible = false;
      this.$emit("done", {});
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      if (submit_info.event_date != null) {
        submit_info.event_date = submit_info.event_date._isValid
          ? submit_info.event_date.format("YYYY-MM-DD")
          : "";
      } else {
        submit_info.meeting_date = "0000-00-00";
      }
      submit_info.quotation_file = this.$refs.quotationFile.get_file_info(
        submit_info.quotation_file
      );
      submit_info.adjuster_file = this.$refs.adjusterFile.get_file_info(
        submit_info.adjuster_file
      );
      submit_info.insurance_file = this.$refs.insuranceFile.get_file_info(
        submit_info.insurance_file
      );
      if (submit_info.type == "添加新種類")
        submit_info.type = submit_info.new_type;

      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      if (this.info.type == "添加新種類")
        var mandatory_property = ["status", "type", "event_date", "new_type"];
      else var mandatory_property = ["event_date", "status", "type"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (
            this.info[mandatory_property[i]] == null ||
            this.info[mandatory_property[i]] == ""
          ) {
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
      u_insurance_claims(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("修改成功");
            this.onClose();
          } else {
            this.$message.error("修改失敗 - api return - " + res.error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("修改失敗 - system error - " + err);
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

