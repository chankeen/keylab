<template>
  <a-modal
    title="Edit Propman Record"
    @close="onClose"
    v-model="visible"
    width="600px"
    :footer="null"
  >
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">物業編號</span>
            <a-input v-model="info.property_id"></a-input>
          </p>
          <p class="item">
            <span class="label">User ID</span>
            <a-input v-model="info.user_id"></a-input>
          </p>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input v-model="info.name_zh" disabled></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input v-model="info.name_en" disabled></a-input>
          </p>
          <p class="item">
            <span class="label">職位</span>
            <a-input v-model="info.position"></a-input>
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
import { u_propman } from "@/api/propman";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        property_id: "",
        user_id: "",
        position: ""
      }
    };
  },
  created() {
    this.get_client();
  },
  methods: {
    show(info) {
      this.info = info;
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
      u_propman(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.onSubmiting = false;
            this.$message.error("更新失敗");
          }
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("更新失敗");
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

