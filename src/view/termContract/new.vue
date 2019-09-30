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
            <span class="label">工程種類</span>
            <a-select v-model="info.type">
              <a-select-option value="清潔">清潔</a-select-option>
              <a-select-option value="電梯/扶手電梯保養">電梯/扶手電梯保養</a-select-option>
              <a-select-option value="防盜及閉路電視">防盜及閉路電視</a-select-option>
              <a-select-option value="消防年檢">消防年檢</a-select-option>
              <a-select-option value="冷氣機系統">冷氣機系統</a-select-option>
              <a-select-option value="清洗水缸">清洗水缸</a-select-option>
              <a-select-option value="５年大廈固定電力裝置檢查">５年大廈固定電力裝置檢查</a-select-option>
              <a-select-option value="法團常年法律顧問">法團常年法律顧問</a-select-option>
              <a-select-option value="大廈全保">大廈全保</a-select-option>
              <a-select-option value="火險(公眾地方)">火險(公眾地方)</a-select-option>
              <a-select-option value="公眾責任保險">公眾責任保險</a-select-option>
              <a-select-option value="第三者保險(法團)">第三者保險(法團)</a-select-option>
              <a-select-option value="添加新種類">添加新種類</a-select-option>
            </a-select>
          </p>
          <p class="item" v-if="info.type == '添加新種類'">
            <span class="label">輸入新種類</span>
            <a-input v-model="info.new_type"></a-input>
          </p>
          <p class="item">
            <span class="label">合約開始</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.contract_start_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">合約完結</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.contract_end_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">合約金額</span>
            <a-input v-model="info.amount"></a-input>
          </p>
          <p class="item">
            <span class="label">合約工程公司</span>
            <a-input
              v-model="info.contractor_name_zh"
              readonly
              @click="()=>{
              $refs.selectRelatedEntity.showModal('contractor_id',['oc','propman'],this.$route.params.bid)
              }"
            ></a-input>
          </p>
          <p class="item">
            <span class="label">合約內容</span>
            <a-input v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">招標文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="tenderFile" v-model="info.tender_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">合約文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="contractFile" v-model="info.contract_file"></uploadFile>
            </span>
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
      <selectRelatedEntity
        :selectType="'radio'"
        ref="selectRelatedEntity"
        @done="onRelatedEntitySelect"
      ></selectRelatedEntity>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import { c_term_contract } from "@/api/term_contract";
import selectRelatedEntity from "@/components/selectRelatedEntity";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        contract_file: [],
        tender_file: [],
        contract_start_date: null,
        contract_end_date: null,
        contractor_name_zh: "請選擇工程公司"
      },
      submit_info: {}
    };
  },
  components: { uploadFile, selectRelatedEntity },
  created() {},
  methods: {
    onRelatedEntitySelect(e) {
      console.log(e);
      this.info.contractor_id = e.related_id;
      this.info.contractor_name_zh = e.name_zh;
      //this.$set(this.info, e.context, e.selectedRowKeys[0]);
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key) && !Array.isArray(this.info[key])) {
          this.info[key] = "";
        }
      }
      this.info.contract_file = [];
      this.info.tender_file = [];
      this.info.contract_start_date = null;
      this.info.contract_end_date = null;

      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      submit_info.contract_file = this.$refs.contractFile.get_file_info(
        submit_info.contract_file
      );
      submit_info.tender_file = this.$refs.tenderFile.get_file_info(
        submit_info.tender_file
      );
      if (submit_info.contract_start_date != null)
        submit_info.contract_start_date = submit_info.contract_start_date
          ._isValid
          ? submit_info.contract_start_date.format("YYYY-MM-DD")
          : "";
      if (submit_info.contract_end_date != null)
        submit_info.contract_end_date = submit_info.contract_end_date._isValid
          ? submit_info.contract_end_date.format("YYYY-MM-DD")
          : "";
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_term_contract(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api reponse - " + res.last_error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("server error - 添加失敗 - " + err);
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

