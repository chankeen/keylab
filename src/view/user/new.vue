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
            <a-select v-model="info.status"></a-select>
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
            <a-input v-model="info.login_tel"></a-input>
          </p>
          <p class="item">
            <span class="label">Email</span>
            <a-input v-model="info.email"></a-input>
          </p>
          <p class="item">
            <span class="label">Created By</span>
            <a-input v-model="info.created_by"></a-input>
          </p>
          <p class="item">
            <span class="label">Created Date</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.creation_datetime"></a-date-picker>
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
import moment from "moment";
import { get_client_data } from "@/api/client_data";
import { new_property } from "@/api/property";
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
    this.get_client();
  },
  methods: {
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
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

      this.info.p_no = this.project_no;
      console.log(this.info);
      this.onSubmiting = true;
      new_property(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗");
          }
        })
        .catch(err => {
          this.$message.error("添加失敗");
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

