<template>
  <a-drawer
    title="Add Property"
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
            <span class="label required">物業狀態</span>
            <a-select v-model="info.status">
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="暫停">暫停</a-select-option>
              <a-select-option value="封存">封存</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">物業種類</span>
            <a-select v-model="info.type">
              <!-- <a-select-option value="---">---請選擇物業種類---</a-select-option> -->
              <a-select-option value="單棟式大廈">單棟式大廈</a-select-option>
              <a-select-option value="大型屋苑大廈">大型屋苑大廈</a-select-option>
              <a-select-option value="屋苑大廈">屋苑大廈</a-select-option>
              <a-select-option value="商廈">商廈</a-select-option>
              <a-select-option value="寫字樓">寫字樓</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label required">物業中文名稱</span>
            <a-input v-model="info.name_zh" placeholder="例如: 萬利豐中心"></a-input>
          </p>
          <p class="item">
            <span class="label">物業英文名稱</span>
            <a-input v-model="info.name_en" placeholder="例如: Malahon Centre"></a-input>
          </p>
          <p class="item">
            <span class="label">物業中文地址</span>
            <a-input v-model="info.address_zh" placeholder="例如: 士丹利街8-12號"></a-input>
          </p>
          <p class="item">
            <span class="label">物業英文地址</span>
            <a-input v-model="info.address_en" placeholder="例如: 8-12 Stanley Street"></a-input>
          </p>
          <p class="item">
            <span class="label required">是否擁有業主立案法團</span>
            <a-switch v-model="info.oc_exist"></a-switch>
          </p>
          <p class="item">
            <span class="label">落成年份</span>
            <a-input v-model="info.build_year" placeholder="例如: 1987"></a-input>
          </p>
          <p class="item">
            <span class="label">樓層總數</span>
            <a-input v-model="info.floor_amount" placeholder="例如: 10"></a-input>
          </p>
          <p class="item">
            <span class="label">單位總數</span>
            <a-input v-model="info.unit_amount" placeholder="例如: 38"></a-input>
          </p>
          <p class="item">
            <span class="label">總面積(平方米)</span>
            <a-input v-model="info.total_size" placeholder="例如: 580"></a-input>
          </p>
          <p class="item">
            <span class="label">圖則檔案(最大25MB)</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.floor_plan_file" />
            </span>
          </p>
          <!-- DMC FIle -->
          <p class="item">
            <span class="label">地契檔案(最大25MB)</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="uploadFile" v-model="info.dmc_file" />
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
import { isHasVal } from "@/utils/validate";
import uploadFile from "@/components/uploadFile.vue";
import { c_property } from "@/api/property.js";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        oc_exist: "",
        status: "",
        name_zh: "",
        name_en: "",
        address_zh: "",
        address_en: "",
        type: "",
        build_year: "",
        floor_amount: "",
        floor_plan_file: [],
        dmc_file: [],
        unit_amount: "",
        total_size: ""
      },
      action_url: ""
    };
  },
  components: { uploadFile },
  created() {},
  methods: {
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.oc_exist = true;
      this.info.status = "正常";
      this.info.type = "單棟式大廈";
      this.info.floor_plan_file = [];
      this.info.dmc_file = [];
      this.visible = true;
      this.onSubmiting = false;
      console.log(this.info);
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data_with_admin_wp_id(sumbmit_info) {
      //submit info data handling
      sumbmit_info.floor_plan_file = this.$refs.uploadFile.get_file_info(
        sumbmit_info.floor_plan_file
      );
      sumbmit_info.dmc_file = this.$refs.uploadFile.get_file_info(
        sumbmit_info.dmc_file
      );
      if (sumbmit_info.oc_exist == true) {
        sumbmit_info.oc_exist = 1;
      } else {
        sumbmit_info.oc_exist = 0;
      }
      sumbmit_info.admin_wp_id = sessionStorage.getItem("admin_wp_id");
      return sumbmit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["status", "type", "name_zh"];
      for (let i = 0; i < mandatory_property.length; i++) {
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
      console.log("wp_id" + sessionStorage.getItem("admin_wp_id"));
      c_property(this.handle_submit_data_with_admin_wp_id(this.submit_info))
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.onSubmiting = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗");
          }
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗 - system error");
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

