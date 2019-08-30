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
            <span class="label">合約種類</span>
            <a-select v-model="info.type">
              <a-select-option value="冷氣">冷氣</a-select-option>
              <a-select-option value="電梯">電梯</a-select-option>
              <a-select-option value="採購">採購</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">合約種類</span>
            <a-select v-model="info.status">
              <a-select-option value="招標">招標</a-select-option>
            </a-select>
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
            <a-input v-model="info.tender_amount"></a-input>
          </p>
          <p class="item">
            <span class="label">招標內容</span>
            <a-input v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">招標檔案</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.contract_file"></uploadFile>
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
import { c_individual_contract } from "@/api/individual_contract";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        term_contract_id: 0,
        type: "",
        status: "",
        tender_start: "",
        tender_end: "",
        tender_amount: "",
        content: "",
        contract_file: []
      }
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
    get_file_info(item) {
      //get info of file
      item.forEach(value => {
        for (var key in value) {
          if (
            key == "name" ||
            key == "url" ||
            key == "uid" ||
            key == "status"
          ) {
            continue;
          }
          delete value[key];
        }
      });
      return item;
    },
    onSubmit() {
      this.info.property_id = this.$route.params.bid;
      this.info.contract_file = this.get_file_info(this.info.contract_file);
      this.onSubmiting = true;
      c_individual_contract(this.info)
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

