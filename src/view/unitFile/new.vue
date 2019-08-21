<template>
  <a-drawer
    title="新增單位紀錄"
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
              <a-select-option value="欠交管理費">欠交管理費</a-select-option>
              <a-select-option value="投訴">投訴</a-select-option>
              <a-select-option value="法律問題">法律問題</a-select-option>
              <a-select-option value="裝修許可">裝修許可</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">文書日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.instrument_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <a-input v-model="info.remarks"></a-input>
          </p>
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
import { c_unit_file } from "@/api/unit_file";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        property_id: "",
        unit_id: "",
        instrument_date: "",
        remarks: "",
        type: ""
      }
    };
  },
  created() {
  },
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
      console.log(this.info);
      c_unit_file(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
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

