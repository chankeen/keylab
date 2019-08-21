<template>
  <a-drawer
    title="額外合約"
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
            <span class="label">相關定期合約編號</span>
            <a-input v-model="info.term_contract_id"></a-input>
          </p>
          <p class="item">
            <span class="label">招標日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.tender_start"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">截標日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.tender_end"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">合約金額</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label">招標內容</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <p class="item">
          <span class="label">招標檔案</span>
          <span style="text-align:left;width:100%">
            <uploadFile v-model="info.floor_plan_file"></uploadFile>
          </span>
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
import uploadFile from "@/components/uploadFile.vue";
import { u_unit_list } from "@/api/unit_list";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {}
    };
  },
  components: { uploadFile },
  created() {
    //this.get_data();
  },
  methods: {
    show(term_contract_id) {
      this.visible = true;
      this.onSubmiting = false;
      this.info.term_contract_id = term_contract_id;
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
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
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

