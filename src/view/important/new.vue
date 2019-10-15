<template>
  <a-drawer
    title="新增法團命令"
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
            <span class="label required">政府法令種類</span>
            <a-select v-model="info.type">
              <a-select-option value="食環署">食環署</a-select-option>
              <a-select-option value="土木工程署">土木工程署</a-select-option>
              <a-select-option value="屋宇署">屋宇署</a-select-option>
              <a-select-option value="消防署">消防署</a-select-option>
              <a-select-option value="機電工程署">機電工程署</a-select-option>
              <a-select-option value="水務署">水務署</a-select-option>
              <a-select-option value="警務署">警務署</a-select-option>
              <a-select-option value="法律訴頌">法律訴頌</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">知悉日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.known_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">參考編號</span>
            <a-input format="DD/MM/YYYY" v-model="info.ref_no"></a-input>
          </p>
          <p class="item">
            <span class="label">處理限期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.deadline"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">政府法令內容</span>
            <a-input placeholder="任意填寫" v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">法令負責人</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectUser.showModal('',[],'')
              }"
            >Search</a-button>
          </p>
          <p class="item" v-if="info.handler_user_id != ''">
            <span class="label">中文名稱</span>
            <a-input readonly v-model="info.name_zh"></a-input>
          </p>
          <p class="item" v-if="info.handler_user_id != ''">
            <span class="label">英文名稱</span>
            <a-input readonly v-model="info.name_en"></a-input>
          </p>
          <p class="item" v-if="info.handler_user_id != ''">
            <span class="label">電話號碼</span>
            <a-input readonly v-model="info.login_tel"></a-input>
          </p>
          <a-divider></a-divider>
          <p class="item">
            <span class="label required">相關文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="importantFile" v-model="info.important_file"></uploadFile>
            </span>
          </p>
          <a-divider />
        </a-col>
        <selectUser :selectType="'radio'" ref="selectUser" @done="onUserSelect"></selectUser>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile";
import selectUser from "@/components/selectUser";
import { c_important } from "@/api/important";
import { isHasVal, isArray } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        type: "",
        known_date: "",
        deadline: "",
        content: "",
        ref_no: "",
        remarks: "",
        important_file: [],
        handler_user_id: "",
        name_zh: "",
        name_en: "",
        login_tel: ""
      }
    };
  },
  components: { uploadFile, selectUser },
  created() {},
  methods: {
    onUserSelect(e) {
      console.log(e.list[e.selectedRowKeys[0]]);
      if (e.list[e.selectedRowKeys[0]].length != 0) {
        this.info.handler_user_id = e.selectedRowKeys[0];
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
      this.info.type = "食環署";
      this.info.known_date = null;
      this.info.deadline = null;
      this.info.important_file = [];
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      var date_property = ["known_date", "deadline"];

      for (let i = 0; i < date_property.length; i++) {
        var check_date = submit_info[date_property[i]];
        console.log(check_date);
        if (check_date != null) {
          check_date = check_date._isValid
            ? check_date.format("YYYY-MM-DD")
            : "";
        } else {
          check_date = "";
        }
        submit_info[date_property[i]] = check_date;
      }

      submit_info.important_file = this.$refs.importantFile.get_file_info(
        submit_info.important_file
      );
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["type", "important_file"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (isArray(this.info[mandatory_property[i]])) {
            if (!this.info[mandatory_property[i]].length > 0) {
              this.$message.error("請上載至少1個檔寨");
              return false;
            }
          } else {
            if (!isHasVal(this.info[mandatory_property[i]])) {
              this.$message.error("請檢查必須填寫的資料");
              return false;
            }
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
      c_important(this.handle_submit_data(this.submit_info))
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

