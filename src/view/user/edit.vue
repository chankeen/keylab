<template>
  <a-modal title="Edit User Record" @close="onClose" v-model="visible" width="600px" :footer="null">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">Status</span>
            <a-select v-model="info.status">
              <a-select-option value="正常">正常</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">Chinese Name</span>
            <a-input v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">English Name</span>
            <a-input v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">Login Tel</span>
            <a-input maxlength="8" v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">Email</span>
            <a-input v-model="info.email"></a-input>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
    </div>
  </a-modal>
</template>
<script>
import moment from "moment";
import { u_users } from "@/api/users";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        status: "",
        name_zh: "",
        name_en: "",
        login_tel: "",
        email: "",
        created_by: "",
        creation_datetime: ""
      }
    };
  },
  created() {
    //this.get_client();
  },
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    onSubmit() {
      this.onSubmiting = true;
      u_users(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.visible = false;
            this.onSubmiting = false;
            this.$emit("done", {});
          } else {
            this.onSubmiting = false;
            this.$message.error("更新失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("更新失敗 - system error -" + err);
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

