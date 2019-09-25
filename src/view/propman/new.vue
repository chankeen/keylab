<template>
  <a-drawer
    title="新增物管人員"
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
            <span class="label">從用戶中揀選</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectUser.showModal('',[])
              }"
            >Search</a-button>
          </p>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input readonly v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input readonly v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">電話號碼</span>
            <a-input readonly v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">職位</span>
            <a-select v-model="info.position">
              <a-select-option value="---">--- 請選擇職位 ---</a-select-option>
              <a-select-option value="分區經理">分區經理</a-select-option>
              <a-select-option value="區經理">區經理</a-select-option>
              <a-select-option value="大廈經理">大廈經理</a-select-option>
              <a-select-option value="大廈主任">大廈主任</a-select-option>
              <a-select-option value="工程主任">工程主任</a-select-option>
              <a-select-option value="技工">技工</a-select-option>
              <a-select-option value="行政文員">行政文員</a-select-option>
              <a-select-option value="會計">會計</a-select-option>
              <a-select-option value="保安主管">保安主管</a-select-option>
              <a-select-option value="保安員">保安員</a-select-option>
              <a-select-option value="清潔人員">清潔人員</a-select-option>
            </a-select>
          </p>
          <div v-if="info.position == '保安員'">
            <p class="item">
              <span class="label">出生年月日</span>
              <a-date-picker format="DD/MM/YYYY" v-model="info.birth_date"></a-date-picker>
            </p>
            <p class="item">
              <span class="label">保安証編號</span>
              <a-input v-model="info.cert_no"></a-input>
            </p>
            <p class="item">
              <span class="label">保安証到期日</span>
              <a-date-picker format="DD/MM/YYYY" v-model="info.cert_due_date"></a-date-picker>
            </p>
            <p class="item">
              <span class="label">體檢報告(70歲以上適用)</span>
              <uploadFile ref="bodyCheckFile" v-model="info.body_check_file"></uploadFile>
            </p>
          </div>
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
      <selectUser :selectType="'radio'" ref="selectUser" @done="onUserSelect"></selectUser>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import selectUser from "@/components/selectUser";
import uploadFile from "@/components/uploadFile.vue";
import { c_propman } from "@/api/propman";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        user_id: "",
        position: "",
        name_zh: "",
        name_en: "",
        login_tel: ""
      }
    };
  },
  created() {},
  components: { uploadFile, selectUser },
  methods: {
    onUserSelect(e) {
      console.log(e.list[e.selectedRowKeys[0]]);
      this.info.user_id = e.selectedRowKeys[0];
      this.info.name_zh = e.list[e.selectedRowKeys[0]].name_zh;
      this.info.name_en = e.list[e.selectedRowKeys[0]].name_en;
      this.info.login_tel = e.list[e.selectedRowKeys[0]].login_tel;
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.position = "---";
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      if (submit_info.position == "保安員") {
        submit_info.body_check_file = this.$refs.bodyCheckFile.get_file_info(
          submit_info.body_check_file
        );
        submit_info.cert_due_date = submit_info.cert_due_date._isValid
          ? submit_info.cert_due_date.format("YYYY-MM-DD")
          : "";
        submit_info.birth_date = submit_info.birth_date._isValid
          ? submit_info.birth_date.format("YYYY-MM-DD")
          : "";
      }
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_propman(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
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

