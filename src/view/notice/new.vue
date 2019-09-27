<template>
  <a-drawer
    title="新增通告"
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
            <span class="label">通告日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.notice_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">通告標題</span>
            <a-input v-model="info.title"></a-input>
          </p>
        </a-col>
        <a-divider />
        <p class="item">
          <span class="label">通告檔案(最大25MB)</span>
          <span style="text-align:left;width:100%">
            <uploadFile ref="uploadFile" v-model="info.notice_file"></uploadFile>
          </span>
        </p>
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
import { c_notice } from "@/api/notice";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        notice_file: [],
        notice_date: "",
        remarks: ""
      }
    };
  },
  created() {},
  components: { uploadFile },
  methods: {
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      //init value
      this.info.notice_date = null;
      this.info.notice_file = [];
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      submit_info.notice_file = this.$refs.uploadFile.get_file_info(
        submit_info.notice_file
      );
      if (submit_info.notice_date != null)
        submit_info.notice_date = submit_info.notice_date._isValid
          ? submit_info.notice_date.format("YYYY-MM-DD")
          : "";
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_notice(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
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

