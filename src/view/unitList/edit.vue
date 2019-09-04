<template>
  <a-drawer
    title="修改/檢視重要事項"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="600px"
  >
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item" hidden>
            <span class="label">物業編號</span>
            <a-input v-model="info.property_id"></a-input>
          </p>
          <p class="item">
            <span class="label">單位層數</span>
            <a-input v-model="info.floor"></a-input>
          </p>
          <p class="item">
            <span class="label">單位號數</span>
            <a-input v-model="info.unit"></a-input>
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
import { u_unit_list } from "@/api/unit_list";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {}
    };
  },
  created() {
    //this.get_data();
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
      u_unit_list(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("更新失敗");
          }
          this.onSubmiting = false;
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

