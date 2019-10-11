<template>
  <a-drawer
    title="修改/檢視會議紀錄"
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
            <span class="label required">會議種類</span>
            <a-select v-model="info.type">
              <a-select-option value="常務會議">常務會議</a-select-option>
              <a-select-option value="年度業主大會">年度業主大會</a-select-option>
              <a-select-option value="特別業主大會">特別業主大會</a-select-option>
              <a-select-option value="特別會議">特別會議</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">會議日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.meeting_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">第N屆</span>
            <a-input-number :min="1" :max="999" v-model="info.oc_term"></a-input-number>
          </p>
          <p class="item">
            <span class="label">第N次</span>
            <a-input-number :min="1" :max="999" v-model="info.minutes_term"></a-input-number>
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
          <a-divider></a-divider>
          <p class="item">
            <span class="label">議程文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="agendaFile" v-model="info.agenda_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">會議紀錄文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="minutesFile" v-model="info.minutes_file"></uploadFile>
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
import { u_minutes } from "@/api/minutes";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {}
    };
  },
  components: { uploadFile, "tinymce-editor": Editor },
  created() {},
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      if (this.info.meeting_date == "0000-00-00") {
        this.info.meeting_date = null;
      } else {
        this.info.meeting_date = moment(this.info.meeting_date, "YYYY-MM-DD");
      }
      if (this.info.agenda_file == null || this.info.agenda_file == "") {
        this.info.agenda_file = [];
      }
      if (this.info.minutes_file == null || this.info.minutes_file == "") {
        this.info.minutes_file = [];
      }
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      if (submit_info.meeting_date != null) {
        submit_info.meeting_date = submit_info.meeting_date._isValid
          ? submit_info.meeting_date.format("YYYY-MM-DD")
          : "";
      } else {
        submit_info.meeting_date = "0000-00-00";
      }

      submit_info.agenda_file = this.$refs.agendaFile.get_file_info(
        submit_info.agenda_file
      );

      submit_info.minutes_file = this.$refs.minutesFile.get_file_info(
        submit_info.minutes_file
      );
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["meeting_date"];
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
      u_minutes(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("修改成功");
            this.visible = false;
            this.$emit("done", {});
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

