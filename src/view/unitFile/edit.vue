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
          <p class="item" v-if="info.unit_id != ''">
            <span class="label">座數</span>
            <a-input readonly v-model="info.block"></a-input>
          </p>
          <p class="item" v-if="info.unit_id != ''">
            <span class="label">樓層</span>
            <a-input readonly v-model="info.floor"></a-input>
          </p>
          <p class="item" v-if="info.unit_id != ''">
            <span class="label">單位</span>
            <a-input readonly v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label required">紀錄種類</span>
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
              <uploadFile ref="uploadFile" v-model="info.unit_file_file"></uploadFile>
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
import { u_unit_file } from "@/api/unit_file";
import { isHasVal, isArray } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
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
      if (this.info.instrument_date == "0000-00-00") {
        this.info.instrument_date = null;
      } else {
        this.info.instrument_date = moment(
          this.info.instrument_date,
          "YYYY-MM-DD"
        );
      }
      if (this.info.unit_file_file == null || this.info.unit_file_file == "") {
        this.info.unit_file_file = [];
      }
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      var date_property = ["instrument_date"];

      for (let i = 0; i < date_property.length; i++) {
        var check_date = submit_info[date_property[i]];
        console.log(check_date);
        if (check_date != null) {
          check_date = check_date._isValid
            ? check_date.format("YYYY-MM-DD")
            : "";
        } else {
          check_date = "";
        }
        submit_info[date_property[i]] = check_date;
      }

      submit_info.unit_file_file = this.$refs.uploadFile.get_file_info(
        submit_info.unit_file_file
      );
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["unit_id", "type"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (isArray(this.info[mandatory_property[i]])) {
            if (!this.info[mandatory_property[i]].length > 0) {
              this.$message.error("請上載至少1個檔寨");
              return false;
            }
          } else {
            if (!isHasVal(this.info[mandatory_property[i]])) {
              this.$message.error("請檢查必須填寫的資料");
              return false;
            }
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
      u_unit_file(this.handle_submit_data(this.submit_info))
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

