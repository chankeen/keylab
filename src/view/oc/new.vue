<template>
  <a-drawer
    title="新增法團成員"
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
            <span class="label required">從 用戶 - 法團成員 中揀選</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectUser.showModal('',[],'oc')
              }"
            >Search</a-button>
          </p>
          <p class="item" v-if="info.user_id != ''">
            <span class="label">中文名稱</span>
            <a-input readonly v-model="info.name_zh"></a-input>
          </p>
          <p class="item" v-if="info.user_id != ''">
            <span class="label">英文名稱</span>
            <a-input readonly v-model="info.name_en"></a-input>
          </p>
          <p class="item" v-if="info.user_id != ''">
            <span class="label">電話號碼</span>
            <a-input readonly v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label required">職位</span>
            <a-select v-model="info.position">
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
            <a-input placeholder="例如: 2019" maxlength="4" v-model="info.year_from"></a-input>
          </p>
          <p class="item">
            <span class="label">年度至</span>
            <a-input placeholder="例如: 2020" maxlength="4" v-model="info.year_to"></a-input>
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
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
      <selectUser :selectType="'radio'" ref="selectUser" @done="onUserSelect"></selectUser>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import selectUser from "@/components/selectUser";
import { c_oc } from "@/api/oc";
import { isHasVal } from "@/utils/validate";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        name_zh: "",
        login_tel: "",
        user_id: "",
        name_en: "",
        position: "",
        year_from: "",
        year_to: "",
        term: "",
        unit: "",
        elected_date: "",
        introduction: ""
      }
    };
  },
  created() {},
  components: { selectUser },
  methods: {
    onUserSelect(e) {
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.user_id = e.selectedRowKeys[0];
        this.info.name_zh = e.list[e.selectedRowKeys[0]].name_zh;
        this.info.name_en = e.list[e.selectedRowKeys[0]].name_en;
        this.info.login_tel = e.list[e.selectedRowKeys[0]].login_tel;
      }
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.position = "主席";
      this.info.elected_date = null;
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      if (submit_info.elected_date != null)
        submit_info.elected_date = submit_info.elected_date._isValid
          ? submit_info.elected_date.format("YYYY-MM-DD")
          : "";
      else submit_info.elected_date = "0000-00-00";

      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["name_zh", "position"];
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
      c_oc(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api return - " + res.error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗 - system error - " + err);
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

