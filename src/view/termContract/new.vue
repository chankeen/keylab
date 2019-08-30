<template>
  <a-drawer
    title="新增常規合約"
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
            <span class="label">工程種類</span>
            <a-select v-model="info.type">
              <a-select-option value="冷氣">冷氣</a-select-option>
              <a-select-option value="電梯">電梯</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">合約由</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.contract_start_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">合約至</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.contract_end_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">合約金額</span>
            <a-input v-model="info.amount"></a-input>
          </p>
          <p class="item">
            <span class="label">相關工程公司id</span>
            <a-input v-model="info.contractor_user_id"></a-input>
          </p>
          <p class="item">
            <span class="label">合約內容</span>
            <a-input v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">合約文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.contract_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">工程由</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.work_start_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">工程至</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.work_end_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">工程文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.work_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">管理公司負責人id</span>
            <a-input v-model="info.propman_user_id"></a-input>
          </p>
          <p class="item">
            <span class="label">合約批核人員id</span>
            <a-input v-model="info.contract_approval_user_id"></a-input>
          </p>
          <p class="item">
            <span class="label">跟進人id</span>
            <a-input v-model="info.buyer_user_id"></a-input>
          </p>
          <p class="item">
            <span class="label">合約服務週期為 每 (數值)(單位) 服務一次</span>
          </p>
          <p class="item">
            <span class="label">合約服務週期(數值)</span>
            <a-input v-model="info.job_period_value"></a-input>
          </p>
          <p class="item">
            <span class="label">合約服務週期(單位)</span>
            <a-select v-model="info.job_period_unit">
              <a-select-option value="天">天</a-select-option>
              <a-select-option value="週">週</a-select-option>
              <a-select-option value="月">月</a-select-option>
              <a-select-option value="年">年</a-select-option>
            </a-select>
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
import uploadFile from "@/components/uploadFile.vue";
import { c_term_contract } from "@/api/term_contract";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {}
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
      this.info.property_id = this.$route.params.bid;
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    get_file_info(item) {
      //get info of file
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
      this.info.contract_file = this.get_file_info(this.info.contract_file);
      this.info.work_file = this.get_file_info(this.info.work_file);
      this.onSubmiting = true;
      console.log(this.info);
      c_unit_list(this.info)
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

