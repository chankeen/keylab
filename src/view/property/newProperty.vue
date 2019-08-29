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
            <span class="label">物業狀態</span>
            <a-select v-model="info.status">
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="暫停">暫停</a-select-option>
              <a-select-option value="封存">封存</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">物業種類</span>
            <a-select v-model="info.type">
              <a-select-option value="單棟式大廈">單棟式大廈</a-select-option>
              <a-select-option value="大型屋苑大廈">大型屋苑大廈</a-select-option>
              <a-select-option value="屋苑大廈">屋苑大廈</a-select-option>
              <a-select-option value="商廈">商廈</a-select-option>
              <a-select-option value="寫字樓">寫字樓</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">物業中文名稱</span>
            <a-input v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">物業英文名稱</span>
            <a-input v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">物業中文地址</span>
            <a-input v-model="info.address_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">物業英文地址</span>
            <a-input v-model="info.address_en"></a-input>
          </p>
          <p class="item">
            <span class="label">年度股東大會日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.agm_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">落成年份</span>
            <a-input v-model="info.build_year"></a-input>
          </p>
          <p class="item">
            <span class="label">樓層總數</span>
            <a-input v-model="info.floor_amount"></a-input>
          </p>
          <p class="item">
            <span class="label">單位總數</span>
            <a-input v-model="info.unit_amount"></a-input>
          </p>
          <p class="item">
            <span class="label">總面積</span>
            <a-input v-model="info.total_size"></a-input>
          </p>
          <p class="item">
            <span class="label">Floor Plan File</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.floor_plan_file" />
            </span>
          </p>
          <!-- DMC FIle -->
          <p class="item">
            <span class="label">DMC File</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.dmc_file" />
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
import { new_property } from "@/api/property.js";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        status: "",
        agm_date: "",
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
  created() {
    console.log('wp_id'+sessionStorage.getItem('admin_wp_id'));
  },
  methods: {
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.floor_plan_file = [];
      this.info.dmc_file = [];
      this.visible = true;
      this.onSubmiting = false;
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
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          if (
            typeof this.info[key] == "object" &&
            !Array.isArray(this.info[key])
          ) {
            this.info[key] = this.info[key]._isValid
              ? this.info[key].format("YYYY-MM-DD")
              : "";
          }
        }
      }
      this.info.floor_plan_file = this.get_file_info(this.info.floor_plan_file);
      this.info.dmc_file = this.get_file_info(this.info.dmc_file);
      this.onSubmiting = true;
      this.info.admin_wp_id = sessionStorage.getItem('admin_wp_id');
      console.log('wp_id'+sessionStorage.getItem('admin_wp_id'));
      new_property(this.info)
        .then(res => {
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

