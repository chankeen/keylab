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
            <span class="label required">會議種類</span>
            <a-select :options="typeOptions" v-model="info.type"></a-select>
          </p>
          <p class="item" v-if="info.type == '添加新種類'">
            <span class="label required">輸入新種類</span>
            <a-input v-model="info.new_type"></a-input>
          </p>
          <p class="item">
            <span class="label required">會議日期</span>
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
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
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
      typeOptions: [],
      info: {
        new_type: "",
        property_id: "",
        type: "",
        meeting_date: "",
        oc_term: "",
        minutes_term: ""
      }
    };
  },
  components: { uploadFile },
  created() {},
  methods: {
    show(typeList) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.meeting_date = null;
      //get type
      Object.assign(this.typeOptions, typeList);
      this.typeOptions.push({ value: "添加新種類", label: "添加新種類" });
      this.info.type = this.typeOptions[0].value;
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
      if (submit_info.meeting_date != null) {
        submit_info.meeting_date = submit_info.meeting_date._isValid
          ? submit_info.meeting_date.format("YYYY-MM-DD")
          : "";
      } else {
        submit_info.meeting_date = "0000-00-00";
      }
      submit_info.minutes_file = this.$refs.minutesFile.get_file_info(
        submit_info.minutes_file
      );
      submit_info.agenda_file = this.$refs.agendaFile.get_file_info(
        submit_info.agenda_file
      );
      if (submit_info.type == "添加新種類")
        submit_info.type = submit_info.new_type;

      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      if (this.info.type == "添加新種類")
        var mandatory_property = ["meeting_date", "new_type"];
      else var mandatory_property = ["meeting_date", "type"];
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
      c_minutes(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.onClose();
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

