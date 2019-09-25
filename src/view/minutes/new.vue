<template>
  <a-drawer
    title="新增會議紀錄"
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
            <span class="label">政府法令種類</span>
            <a-select v-model="info.type">
              <a-select-option value="---">--- 請選擇種類 ---</a-select-option>
              <a-select-option value="常務會議">常務會議</a-select-option>
              <a-select-option value="年度業主大會">年度業主大會</a-select-option>
              <a-select-option value="特別業主大會">特別業主大會</a-select-option>
              <a-select-option value="特別會議">特別會議</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">會議日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.meeting_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">第N屆</span>
            <a-input-number placeholder="例如: 1" :min="1" :max="99" v-model="info.oc_term"></a-input-number>
          </p>
          <p class="item">
            <span class="label">第N次</span>
            <a-input-number placeholder="例如: 1" :min="1" :max="999" v-model="info.minutes_term"></a-input-number>
          </p>
          <a-divider />
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
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import { c_minutes } from "@/api/minutes";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        type: "",
        meeting_date: "",
        oc_term: "",
        minutes_term: "",
        minutes_file: []
      }
    };
  },
  components: { uploadFile },
  created() {},
  methods: {
    show() {
      this.info.type = "---";
      this.info.meeting_date = null;
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      submit_info.meeting_date = submit_info.meeting_date._isValid
        ? submit_info.meeting_date.format("YYYY-MM-DD")
        : "";
      submit_info.minutes_file = this.$refs.minutesFile.get_file_info(
        submit_info.minutes_file
      );
      submit_info.agenda_file = this.$refs.agendaFile.get_file_info(
        submit_info.agenda_file
      );
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_minutes(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api return - " + res.error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗 - system error - " + err);
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

