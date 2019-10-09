<template>
  <a-drawer
    title="修改常規合約"
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
              :contractid="info.term_contract_id"
              :contracttype="'term'"
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
import moment from "moment";
import Editor from "@tinymce/tinymce-vue";
import uploadFile from "@/components/uploadFile.vue";
import { u_term_contract } from "@/api/term_contract";
import selectRelatedEntity from "@/components/selectRelatedEntity";
import contractRelatedEntity from "@/components/contractRealtedEntity.vue";
import { r_term_contract_related_entity } from "@/api/term_contract_related_entity";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      typeOptions: [],
      info: {
        type: "",
        new_type: ""
      },
      submit_info: {}
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
      r_term_contract_related_entity(this.info.term_contract_id)
        .then(res => {
          //init entity list
          this.info.entity_list = res.list.map(item => ({
            type: item.type,
            related_entity_id: item.term_contract_related_entity_id,
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
          this.info.contract_start_date =
            this.info.contract_start_date == "0000-00-00"
              ? null
              : moment(this.info.contract_start_date, "YYYY-MM-DD");
          this.info.contract_end_date =
            this.info.contract_end_date == "0000-00-00"
              ? null
              : moment(this.info.contract_end_date, "YYYY-MM-DD");
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
    show(record, typeList) {
      //Keen: temp solution for newtype can't keyin
      record.new_type = "";
      this.info = JSON.parse(JSON.stringify(record));
      Object.assign(this.typeOptions, typeList);
      this.init();
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
      u_term_contract(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.onClose();
            this.$emit("done", {});
          } else {
            this.$message.error("更新失败 - api response - " + res.error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("server error - 更新失败");
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

