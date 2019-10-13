<template>
  <a-drawer
    title="Add User Record"
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
            <span class="label required">Status</span>
            <a-select v-model="info.status">
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="離職">離職</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">Type</span>
            <a-select v-model="info.type">
              <a-select-option value="個人">個人</a-select-option>
              <a-select-option value="公司">公司</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">Chinese Name</span>
            <a-input placeholder="例如: 陳大文" v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">English Name</span>
            <a-input placeholder="Chan Tai Man" v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label required">Login Tel</span>
            <a-input placeholder="例如: 98769876" maxlength="8" v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">Backup Tel</span>
            <a-input maxlength="8" v-model="info.backup_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">Email</span>
            <a-input placeholder="例如: chantaiman@gmail.com" v-model="info.email"></a-input>
          </p>
          <p class="item">
            <span class="label">Fax</span>
            <a-input placeholder="例如: chantaiman@gmail.com" v-model="info.fax"></a-input>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import { c_users } from "@/api/users.js";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        type: "",
        status: "",
        category: "",
        name_zh: "",
        name_en: "",
        login_tel: "",
        backup_tel: "",
        email: "",
        fax: "",
        created_by: ""
      }
    };
  },
  created() {},
  methods: {
    show() {
      //added for non null result
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.category = "propman";
      this.info.status = "正常";
      this.info.type = "個人";
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["status", "type", "name_zh", "login_tel"];
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
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          if (typeof this.info[key] == "object") {
            this.info[key] = this.info[key]._isValid
              ? this.info[key].format("YYYY-MM-DD")
              : "";
          }
        }
      }
      this.onSubmiting = true;
      this.info.created_by = sessionStorage.admin_wp_id;
      console.log(this.info);
      c_users(this.info)
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
          this.visible = false;
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

