<template>
  <a-drawer
    title="新增雜項"
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
            <span class="label required">雜項標題</span>
            <a-input v-model="info.title"></a-input>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <tinymce-editor
              api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
              v-model="info.content"
              style="width:100%"
              :init="{plugins: 'wordcount'}"
            ></tinymce-editor>
          </p>
          <a-divider />
          <p class="item">
            <span class="label">雜項文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="noteFile" v-model="info.note_file"></uploadFile>
            </span>
          </p>
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
import Editor from "@tinymce/tinymce-vue";
import { c_notes } from "@/api/notes";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        title: "",
        content: "",
        note_file: []
      }
    };
  },
  components: { uploadFile, "tinymce-editor": Editor },
  created() {},
  methods: {
    show(typeList) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.note_file = null;

      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
      this.$emit("done", {});
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      submit_info.note_file = this.$refs.noteFile.get_file_info(
        submit_info.note_file
      );

      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      var mandatory_property = ["title"];
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
      c_notes(this.handle_submit_data(this.submit_info))
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

