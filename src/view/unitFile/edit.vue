<template>
  <a-drawer
    title="修改單位紀錄"
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
            <span class="label">單位編號</span>
            <a-input v-model="info.unit_id"></a-input>
          </p>
          <p class="item">
            <span class="label">紀錄種類</span>
            <a-select v-model="info.type">
              <a-select-option value="欠其他款項">欠其他款項</a-select-option>
              <a-select-option value="管理費按金">管理費按金</a-select-option>
              <a-select-option value="法律問題">法律問題</a-select-option>
              <a-select-option value="裝修申請">裝修申請</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">紀錄日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.instrument_date"></a-date-picker>
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
            <span class="label">Unit File File</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.unit_file_file"></uploadFile>
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
import Editor from "@tinymce/tinymce-vue";
import uploadFile from "@/components/uploadFile.vue";
import { u_unit_file } from "@/api/unit_file";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {}
    };
  },
  created() {
    //this.get_data();
  },
  components: { uploadFile, "tinymce-editor": Editor },
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      this.info.instrument_date = moment(
        this.info.instrument_date,
        "YYYY-MM-DD"
      );
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    //提取文件信息
    get_file_info(item) {
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
      this.onSubmiting = true;
      this.info.unit_file_file = this.get_file_info(this.info.unit_file_file);
      u_unit_file(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("修改成功");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("修改失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("修改失敗");
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

