<template>
  <div class="property-home-container">
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
          <span class="label">是否擁有業主立案法團</span>
          <a-switch v-model="info.oc_exist"></a-switch>
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
          <span class="label">備註</span>
          <tinymce-editor
            api-key="mozvg0we1rlktvz6lus7pmfhq3u22gjcw0i5ndkthiwflpei"
            v-model="info.remarks"
            style="width:100%"
            :init="{plugins: 'wordcount'}"
          ></tinymce-editor>
        </p>
        <!-- Floor Plan FIle -->
        <p class="item">
          <span class="label">圖則檔案(jpg,png or pdf)</span>
          <span style="text-align:left;width:100%">
            <uploadFile ref="uploadFile" v-model="info.floor_plan_file"></uploadFile>
          </span>
        </p>
        <!-- DMC FIle -->
        <p class="item">
          <span class="label">地契檔案(jpg,png or pdf)</span>
          <span style="text-align:left;width:100%">
            <uploadFile ref="dmcFile" v-model="info.dmc_file"></uploadFile>
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
import Editor from "@tinymce/tinymce-vue";
import uploadFile from "@/components/uploadFile.vue";
import { r_property, u_property } from "@/api/property.js";
export default {
  data() {
    return {
      visible: false,
      property_id: "",
      uid: "",
      info: {},
      content: "",
      submit_info: {},
      onSubmiting: false
    };
  },
  components: { uploadFile, "tinymce-editor": Editor },
  created() {
    this.property_id = this.$route.params.bid;
    this.uid = sessionStorage.getItem("admin_wp_id");
    this.info.remarks = "";
    this.getInfo();
  },
  methods: {
    //獲取property info
    getInfo() {
      r_property(this.uid, this.property_id)
        .then(res => {
          this.info = res.list[0];
          if (this.info.oc_exist == "1") {
            this.info.oc_exist = true;
          } else {
            this.info.oc_exist = false;
          }
        })
        .catch(err => {});
    },
    handle_submit_data(sumbmit_info) {
      //submit info data handling
      sumbmit_info.floor_plan_file = this.$refs.uploadFile.get_file_info(
        sumbmit_info.floor_plan_file
      );
      sumbmit_info.dmc_file = this.$refs.dmcFile.get_file_info(
        sumbmit_info.dmc_file
      );
      if (sumbmit_info.oc_exist == true) {
        sumbmit_info.oc_exist = 1;
      } else {
        sumbmit_info.oc_exist = 0;
      }
      return sumbmit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      u_property(this.handle_submit_data(this.submit_info))
        .then(res => {
          console.log(res);
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