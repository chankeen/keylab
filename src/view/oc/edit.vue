<template>
  <a-modal title="修改法團成員" @close="onClose" v-model="visible" width="600px" :footer="null">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input disabled v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input disabled v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">電話號碼</span>
            <a-input disabled v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">職位</span>
            <a-select v-model="info.position">
              <a-select-option value="---">---請選擇職位---</a-select-option>
              <a-select-option value="主席">主席</a-select-option>
              <a-select-option value="副主席">副主席</a-select-option>
              <a-select-option value="秘書">秘書</a-select-option>
              <a-select-option value="司庫">司庫</a-select-option>
              <a-select-option value="委員">委員</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">年度由</span>
            <a-input maxlength="4" v-model="info.year_from"></a-input>
          </p>
          <p class="item">
            <span class="label">年度至</span>
            <a-input maxlength="4" v-model="info.year_to"></a-input>
          </p>
          <p class="item">
            <span class="label">第N屆</span>
            <a-input-number :min="1" :max="99" v-model="info.term"></a-input-number>
          </p>
          <p class="item">
            <span class="label">當選日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.elected_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">單位</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <tinymce-editor
              api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
              v-model="info.introduction"
              style="width:100%;height:400px;"
              :init="{plugins: 'wordcount'}"
            ></tinymce-editor>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
    </div>
  </a-modal>
</template>
<script>
import moment from "moment";
import Editor from "@tinymce/tinymce-vue";
import { u_oc } from "@/api/oc";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        name_zh: "",
        name_en: "",
        position: "",
        year_from: "",
        year_to: "",
        term: "",
        elected_date: "",
        introduction: ""
      }
    };
  },
  components: { "tinymce-editor": Editor },
  created() {},
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      this.info.elected_date = moment(this.info.elected_date, "YYYY-MM-DD");
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      submit_info.elected_date = submit_info.elected_date._isValid
        ? submit_info.elected_date.format("YYYY-MM-DD")
        : "";
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      u_oc(this.handle_submit_data(this.submit_info))
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

