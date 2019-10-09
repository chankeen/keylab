<template>
  <a-modal title="修改承辦商" :afterClose="onClose" v-model="visible" width="600px" :footer="null">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input v-model="info.name_zh" disabled></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input v-model="info.name_en" disabled></a-input>
          </p>
          <p class="item">
            <span class="label">電話號碼</span>
            <a-input v-model="info.login_tel" disabled></a-input>
          </p>
          <p class="item">
            <span class="label required">種類</span>
            <a-select :options="blockOptions" v-model="info.type"></a-select>
          </p>
          <p class="item" v-if="info.type == '添加新種類'">
            <span class="label required">輸入新種類</span>
            <a-input v-model="info.new_type"></a-input>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <tinymce-editor
              api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
              v-model="info.remarks"
              style="width:100%;height:400px;"
              :init="{plugins: 'wordcount'}"
            ></tinymce-editor>
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
import { u_contractor } from "../../api/contractor";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      blockOptions: [],
      info: {
        property_id: "",
        user_id: "",
        name_zh: "",
        name_en: "",
        login_tel: "",
        type: "",
        remarks: "",
        new_type: ""
      }
    };
  },
  components: { uploadFile, "tinymce-editor": Editor },
  created() {},
  methods: {
    show(info, blockList) {
      this.info = JSON.parse(JSON.stringify(info));
      //init type select
      Object.assign(this.blockOptions, blockList);
      this.blockOptions.push({ value: "添加新種類", label: "添加新種類" });
      this.info.type = this.blockOptions[0].value;
      this.info.new_type = "";
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      //on leave clear status
      console.log("edit CLOSe");
      this.blockOptions = [];
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      if (submit_info.type == "添加新種類")
        submit_info.type = submit_info.new_type;
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      if (this.info.type == "添加新種類") var mandatory_property = ["new_type"];
      else var mandatory_property = [];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (!isHasVal(this.info[mandatory_property[i]])) {
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
      u_contractor(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.visible = false;
            this.$emit("done", {});
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

