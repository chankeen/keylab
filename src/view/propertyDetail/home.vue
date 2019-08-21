<template>
  <div class="property-home-container">
    <a-row>
      <a-col>
        <p class="item">
          <span class="label">物業狀態</span>
          <a-input v-model="info.status" />
        </p>
        <p class="item">
          <span class="label">物業種類</span>
          <a-input v-model="info.type" />
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
        <!-- Floor Plan FIle -->
        <p class="item">
          <span class="label">Floor Plan File</span>
          <span style="text-align:left;width:100%">
            <uploadFile v-model="info.floor_plan_file"></uploadFile>
          </span>
        </p>
        <!-- DMC FIle -->
        <p class="item">
          <span class="label">DMC File</span>
          <span style="text-align:left;width:100%">
            <uploadFile v-model="info.dmc_file"></uploadFile>
          </span>
        </p>
        <p style="text-align:right">
          <a-button
            type="primary"
            :loading="onSubmiting"
            @click="()=>{
            onSubmit()
            }"
          >Submit</a-button>
        </p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile.vue";
import { get_property, update_property } from "@/api/property.js";
export default {
  data() {
    return {
      property_id: "",
      uid: "",
      info: {},
      onSubmiting: false
    };
  },
  components: { uploadFile },
  created() {
    this.property_id = this.$route.params.bid;
    this.uid = this.$store.getters.user.uid;
    this.getInfo();
  },
  methods: {
    //獲取property info
    getInfo() {
      get_property(this.uid, this.property_id)
        .then(res => {
          this.info = res.list[0];
          this.info.agm_date = moment(this.info.agm_date, "YYYY-MM-DD");
        })
        .catch(err => {});
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
      this.info.admin_wp_id = this.$store.getters.user.uid;
      update_property(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("更新成功");
            this.visible = false;
            this.onSubmiting = false;
          } else {
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
.property-home-container {
  max-width: 1000px;
  text-align: start;
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