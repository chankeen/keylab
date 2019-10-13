<template>
  <a-modal title="修改通告" @close="onClose" v-model="visible" width="600px" :footer="null">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <a-col>
            <p class="item">
              <span class="label">通告日期</span>
              <a-date-picker format="DD/MM/YYYY" v-model="info.notice_date"></a-date-picker>
            </p>
            <p class="item">
              <span class="label">通告標題</span>
              <a-select :options="titleOptions" v-model="info.title"></a-select>
            </p>
            <p class="item" v-if="info.title == '添加新標題'">
              <span class="label">輸入新標題</span>
              <a-input v-model="info.new_title"></a-input>
            </p>
          </a-col>
          <p class="item">
            <span class="label">備註</span>
            <tinymce-editor
              api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
              v-model="info.remarks"
              style="width:100%;height:400px;"
              :init="{plugins: 'wordcount'}"
            ></tinymce-editor>
          </p>
          <a-divider />
          <p class="item">
            <span class="label required">通告檔案(最大25MB)</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="uploadFile" v-model="info.notice_file"></uploadFile>
            </span>
          </p>
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
  </a-modal>
</template>
<script>
import moment from "moment";
import Editor from "@tinymce/tinymce-vue";
import uploadFile from "@/components/uploadFile.vue";
import { u_notice } from "@/api/notice";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      titleOptions: [],
      info: {
        property_id: "",
        user_id: "",
        position: "",
        remarks: ""
      }
    };
  },
  components: { uploadFile, "tinymce-editor": Editor },
  created() {},
  methods: {
    show(info, titleList) {
      this.info = JSON.parse(JSON.stringify(info));
      Object.assign(this.titleOptions, titleList);
      this.titleOptions.push({ value: "添加新標題", label: "添加新標題" });
      this.info.title = this.titleOptions[0].value;
      if (this.info.notice_date == "0000-00-00") {
        this.info.notice_date = null;
      } else {
        this.info.notice_date = moment(this.info.notice_date, "YYYY-MM-DD");
      }
      if (this.info.notice_file == null || this.info.notice_file == "") {
        this.info.notice_file = [];
      }
      this.$set(this.info, "new_title", "");
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.titleOptions = [];
      this.visible = false;
      this.$emit("done", {});
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      submit_info.notice_file = this.$refs.uploadFile.get_file_info(
        submit_info.notice_file
      );
      if (submit_info.title == "添加新標題")
        submit_info.title = submit_info.new_title;

      if (submit_info.notice_date != null)
        submit_info.notice_date = submit_info.notice_date._isValid
          ? submit_info.notice_date.format("YYYY-MM-DD")
          : "";
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["notice_file"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (!this.info[mandatory_property[i]].length > 0) {
            this.$message.error("請上載至少1個檔寨");
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
      u_notice(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.onClose();
          } else {
            this.onSubmiting = false;
            this.$message.error("更新失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("更新失敗 - system error - " + err);
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

