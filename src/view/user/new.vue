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
            <span class="label">Status</span>
            <a-select v-model="info.status">
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="離職">離職</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">Chinese Name</span>
            <a-input placeholder="例如: 陳大文" v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">English Name</span>
            <a-input placeholder="Chan Tai Man" v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">Login Tel</span>
            <a-input placeholder="例如: 98769876" maxlength="8" v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">Email</span>
            <a-input placeholder="例如: chantaiman@gmail.com" v-model="info.email"></a-input>
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
import { c_users } from "@/api/users.js";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        status: "正常",
        name_zh: "",
        name_en: "",
        login_tel: "",
        email: "",
        created_by: ""
      }
    };
  },
  created() {},
  methods: {
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.status = "正常";
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
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

