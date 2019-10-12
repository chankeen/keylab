<template>
  <a-drawer
    title="新增一次性合约"
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
              <a-select-option value="工程進行中">工程進行中</a-select-option>
              <a-select-option value="已完成">已完成</a-select-option>
              <a-select-option value="待處理">待處理</a-select-option>
            </a-select>
          </p>
          <!-- <p class="item">
            <span class="label">一次性合約編號</span>
            <a-input v-model="info.term_contract_id"></a-input>
          </p>
          <p class="item">
            <span class="label">檢查報告編號</span>
            <a-input v-model="info.regular_report_id"></a-input>
          </p>-->
          <p class="item">
            <span class="label required">工程種類</span>
            <a-select :options="typeOptions" v-model="info.type"></a-select>
          </p>
          <p class="item" v-if="info.type == '添加新種類'">
            <span class="label required">輸入新種類</span>
            <a-input v-model="info.new_type"></a-input>
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
            <span class="label">工程地點</span>
            <a-select :options="locationOptions" v-model="info.location"></a-select>
          </p>
          <p class="item" v-if="info.location == '添加新地點'">
            <span class="label">輸入新地點</span>
            <a-input v-model="info.new_location"></a-input>
          </p>
          <p class="item">
            <span class="label">保養到期日</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.waranty_period"></a-date-picker>
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
import uploadFile from "@/components/uploadFile.vue";
import moment from "moment";
import { c_individual_contract } from "@/api/individual_contract.js";
import selectRelatedEntity from "@/components/selectRelatedEntity";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      typeOptions: [],
      locationOptions: [],
      info: {
        status: "",
        contract_file: [],
        tender_file: [],
        waranty_period: null,
        contractor_name_zh: "",
        type: "",
        location: "",
        contractor_id: 0,
        content: "",
        new_type: "",
        amount: ""
      }
    };
  },
  components: { uploadFile, selectRelatedEntity },
  created() {},
  methods: {
    onRelatedEntitySelect(e) {
      if (e.hasOwnProperty("related_id")) {
        console.log(e);
        this.info.contractor_id = e.related_id;
        this.info.contractor_name_zh = e.name_zh;
      }
      //this.$set(this.info, e.context, e.selectedRowKeys[0]);
    },
    show(typeList, locationList) {
      //clear all data
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key) && !Array.isArray(this.info[key])) {
          this.info[key] = "";
        }
      }
      //get list data from calling
      Object.assign(this.typeOptions, typeList);
      Object.assign(this.locationOptions, locationList);
      //init options list data
      this.typeOptions.push({ value: "添加新種類", label: "添加新種類" });
      this.info.type = this.typeOptions[0].value;
      this.locationOptions.push({ value: "不適用", label: "不適用" });
      this.locationOptions.push({ value: "添加新地點", label: "添加新地點" });
      this.info.location = this.locationOptions[0].value;
      //init data
      this.info.status = "已完成";
      this.info.contract_file = [];
      this.info.tender_file = [];
      this.info.waranty_period = null;
      //init status
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      //removeList value prevent duplicate list value
      this.typeOptions = [];
      this.locationOptions = [];
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      submit_info.contract_file = this.$refs.contractFile.get_file_info(
        submit_info.contract_file
      );
      submit_info.tender_file = this.$refs.tenderFile.get_file_info(
        submit_info.tender_file
      );
      if (submit_info.waranty_period != null)
        submit_info.waranty_period = submit_info.waranty_period._isValid
          ? submit_info.waranty_period.format("YYYY-MM-DD")
          : "";
      submit_info.type =
        submit_info.type == "添加新種類"
          ? submit_info.new_type
          : submit_info.type;
      submit_info.location =
        submit_info.location == "添加新地點"
          ? submit_info.new_location
          : submit_info.location;
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
      c_individual_contract(this.handle_submit_data(this.submit_info))
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

