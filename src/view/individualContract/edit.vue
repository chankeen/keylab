<template>
  <a-drawer
    title="修改一次性合约"
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
            <span class="label">相關人員/公司</span>
            <contractRelatedEntity
              ref="contractRelatedEntity"
              :contractid="info.individual_contract_id"
              :contracttype="'individual'"
              v-model="info.entity_list"
              @submit="update_related_entity_list"
            ></contractRelatedEntity>
          </p>
        </a-col>
        <a-divider />
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
            <span class="label">常規合約編號</span>
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
          <p class="item">
            <span class="label">備註</span>
            <tinymce-editor
              api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
              v-model="info.remarks"
              style="width:100%"
              :init="{plugins: 'wordcount'}"
            ></tinymce-editor>
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
import Editor from "@tinymce/tinymce-vue";
import moment from "moment";
import { u_individual_contract } from "@/api/individual_contract.js";
import selectRelatedEntity from "@/components/selectRelatedEntity";
import contractRelatedEntity from "@/components/contractRealtedEntity.vue";
import {
  r_individual_contract_related_entity,
  d_individual_contract_related_entity
} from "@/api/individual_contract_related_entity";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        new_type: ""
      },
      submit_info: {},
      typeOptions: [],
      locationOptions: []
    };
  },
  components: {
    uploadFile,
    selectRelatedEntity,
    contractRelatedEntity,
    "tinymce-editor": Editor
  },
  created() {},
  methods: {
    update_related_entity_list() {
      this.init();
    },
    onRelatedEntitySelect(e) {
      if (e.hasOwnProperty("related_id")) {
        console.log(e);
        this.info.contractor_id = e.related_id;
        this.info.contractor_name_zh = e.name_zh;
      }
      //this.$set(this.info, e.context, e.selectedRowKeys[0]);
    },
    init() {
      r_individual_contract_related_entity(this.info.individual_contract_id)
        .then(res => {
          //init entity list
          this.info.entity_list = res.list.map(item => ({
            type: item.type,
            related_entity_id: item.individual_contract_related_entity_id,
            name_zh: item.name_zh,
            login_tel: item.login_tel,
            role: item.role
          }));
          this.info.entity_list.forEach((element, index) => {
            if (element.type == "oc")
              this.info.entity_list[index].display_type = "法團成員";
            else if (element.type == "propman")
              this.info.entity_list[index].display_type = "物管人員";
            else if (element.type == "contractor")
              this.info.entity_list[index].display_type = "承辦商";
            else this.info.entity_list[index].display_type = "未知";
          });

          //Keen: dont know why cant add this line in here, but new type v-model cant keyin
          //this.info.new_type = "";

          //init calaender
          this.info.waranty_period =
            this.info.waranty_period == "0000-00-00"
              ? null
              : moment(this.info.waranty_period, "YYYY-MM-DD");
          //file init
          if (this.info.tender_file == null || this.info.tender_file == "")
            this.info.tender_file = [];

          if (this.info.contract_file == null || this.info.contract_file == "")
            this.info.contract_file = [];

          //state init
          this.visible = true;
          this.onSubmiting = false;
        })
        .catch(err => {});
    },
    show(record, typeList, locationList) {
      //Keen: temp solution for newtype can't keyin
      record.new_type = "";
      this.info = JSON.parse(JSON.stringify(record));
      //get list data from calling
      Object.assign(this.typeOptions, typeList);
      Object.assign(this.locationOptions, locationList);
      //init options list data
      this.typeOptions.push({ value: "添加新種類", label: "添加新種類" });
      this.info.type = this.typeOptions[0].value;
      this.locationOptions.push({ value: "不適用", label: "不適用" });
      this.locationOptions.push({ value: "添加新地點", label: "添加新地點" });
      this.info.location = this.locationOptions[0].value;

      this.init();
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
      if (submit_info.type == "添加新種類")
        submit_info.type = submit_info.new_type;
      else submit_info.type = submit_info.type;
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
      u_individual_contract(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("修改成功");
            this.onClose();
            this.$emit("done", {});
          } else {
            this.$message.error("修改失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("server error - 修改失敗");
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

