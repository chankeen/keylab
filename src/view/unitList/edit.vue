<template>
  <a-drawer
    title="修改單位檔案"
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
            <span class="label">物業名稱</span>
            <a-input disabled v-model="info.block"></a-input>
          </p>
          <p class="item">
            <span class="label">單位層數</span>
            <a-input disabled v-model="info.floor"></a-input>
          </p>
          <p class="item">
            <span class="label">單位號數</span>
            <a-input disabled v-model="info.unit"></a-input>
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
        </a-col>
      </a-row>
      <p class="item">
        <span class="label">單位相關檔案(最大25MB)</span>
        <span style="text-align:left;width:100%">
          <uploadFile v-model="info.file"></uploadFile>
        </span>
      </p>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import Editor from "@tinymce/tinymce-vue";
import { u_unit_list } from "@/api/unit_list";
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
  created() {
    //this.get_data();
  },
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      this.visible = true;
      this.onSubmiting = false;
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
            this.$message.success("更新成功");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("更新失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("更新失敗");
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

