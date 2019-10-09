<template>
  <a-drawer
    title="新增單位"
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
            <span class="label required">物業名稱</span>
            <a-select :options="blockOptions" v-model="info.block"></a-select>
          </p>
          <p class="item" v-show="info.block == '添加新物業'">
            <span class="label required">請輸入物業名稱</span>
            <a-input v-model="info.newblock"></a-input>
          </p>
          <p class="item">
            <span class="label required">單位層數</span>
            <a-input v-model="info.floor"></a-input>
          </p>
          <p class="item">
            <span class="label required">單位號數</span>
            <a-input v-model="info.unit"></a-input>
          </p>
          <a-divider />
          <p class="item">
            <span class="label">單位相關檔案(最大25MB)</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="uploadFile" v-model="info.file"></uploadFile>
            </span>
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
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import { c_unit_list } from "@/api/unit_list";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      blockOptions: [],
      info: {
        type: "",
        block: "",
        floor: "",
        unit: "",
        new_type: ""
      }
    };
  },
  components: { uploadFile },
  created() {},
  methods: {
    show(blockList) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      Object.assign(this.blockOptions, blockList);
      this.blockOptions.push({ value: "添加新物業", label: "添加新物業" });
      this.info.block = this.blockOptions[0].value;
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.blockOptions = [];
      this.visible = false;
      this.$emit("done", {});
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      submit_info.file = this.$refs.uploadFile.get_file_info(submit_info.file);
      submit_info.property_id = this.$route.params.bid;
      if (submit_info.block == "添加新物業")
        submit_info.block = submit_info.newblock;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      if (this.info.block == "添加新物業")
        var mandatory_property = ["newblock", "floor", "unit"];
      else var mandatory_property = ["floor", "unit"];

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
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_unit_list(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.onClose();
          } else {
            this.$message.error("添加失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("server error - 添加失敗");
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

