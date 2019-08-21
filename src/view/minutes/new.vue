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
            <span class="label">物業編號</span>
            <a-input v-model="info.property_id"></a-input>
          </p>
          <p class="item">
            <span class="label">重要事項種類</span>
            <a-select v-model="info.type">
              <a-select-option value="常務會議">政府法令</a-select-option>
              <a-select-option value="年度股東大會">年度股東大會</a-select-option>
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
            <a-input v-model="info.oc_term"></a-input>
          </p>
          <p class="item">
            <span class="label">第N次</span>
            <a-input v-model="info.minutes_term"></a-input>
          </p>
          <a-divider></a-divider>
          <p class="item">
            <span class="label">Minutes File</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.minutes_file"></uploadFile>
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
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
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
      this.info.minutes_file = this.get_file_info(this.info.minutes_file);
      this.onSubmiting = true;
      c_minutes(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
          } else {
            this.$message.error("添加失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("server error - 添加失敗");
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

