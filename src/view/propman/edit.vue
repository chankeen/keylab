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
            <a-select v-model="info.property_id"></a-select>
          </p>
          <p class="item">
            <span class="label">User ID</span>
            <a-select v-model="info.user_id">
              <a-select-option value="單棟式大廈">單棟式大廈</a-select-option>
              <a-select-option value="大型屋苑大廈">大型屋苑大廈</a-select-option>
              <a-select-option value="屋苑大廈">屋苑大廈</a-select-option>
              <a-select-option value="商廈">商廈</a-select-option>
              <a-select-option value="寫字樓">寫字樓</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input v-model="info.name_en"></a-input>
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
import { new_property } from "@/api/property";
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

