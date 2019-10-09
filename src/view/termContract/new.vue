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
            <span class="label required">合約狀態</span>
            <a-select v-model="info.status">
              <a-select-option value="生效中">生效中</a-select-option>
              <a-select-option value="以往合約">以往合約</a-select-option>
              <a-select-option value="待處理">待處理</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">工程種類</span>
            <a-select :options="typeOptions" v-model="info.type"></a-select>
          </p>
          <p class="item" v-if="info.type == '添加新種類'">
            <span class="label required">輸入新種類</span>
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
            <span class="label required">合約工程公司</span>
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
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
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
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      typeOptions: [],
      info: {
        type: "",
        contract_file: [],
        tender_file: [],
        contract_start_date: null,
        contract_end_date: null,
        contractor_name_zh: "",
        contractor_id: 0,
        amount: "",
        content: "",
        job_period_unit: "",
        job_period_value: "",
        new_type: ""
      },
      submit_info: {}
    };
  },
  components: { uploadFile, selectRelatedEntity },
  created() {},
  methods: {
    onRelatedEntitySelect(e) {
      {
        console.log(e);
        if (e.hasOwnProperty("related_id")) {
          this.info.contractor_id = e.related_id;
          this.info.contractor_name_zh = e.name_zh;
        }
      }
      //this.$set(this.info, e.context, e.selectedRowKeys[0]);
    },
    show(typeList) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key) && !Array.isArray(this.info[key])) {
          this.info[key] = "";
        }
      }
      Object.assign(this.typeOptions, typeList);

      this.info.type = this.typeOptions[0].value;

      this.info.status = "生效中";
      this.info.contract_file = [];
      this.info.tender_file = [];
      this.info.contract_start_date = null;
      this.info.contract_end_date = null;

      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.typeOptions = [];
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

      if (submit_info.type == "添加新種類")
        submit_info.type = submit_info.new_type;
      else submit_info.type = submit_info.type;

      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      if (this.info.type == "添加新種類") {
        var mandatory_property = [
          "status",
          "type",
          "new_type",
          "contractor_id"
        ];
      } else {
        var mandatory_property = ["status", "type", "contractor_id"];
      }
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
      c_term_contract(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.onClose();
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api reponse - " + res.error);
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

