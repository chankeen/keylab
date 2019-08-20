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
            <a-upload
              name="orm_file"
              :multiple="true"
              action
              :headers="headers"
              @change="handleChange"
            >
              <a-button>
                <a-icon type="upload" />Click to Upload
              </a-button>
            </a-upload>
          </span>
        </p>
        <!-- DMC FIle -->
        <p class="item">
          <span class="label">DMC File</span>
          <span style="text-align:left;width:100%">
            <a-upload
              name="orm_file"
              :multiple="true"
              action
              :headers="headers"
              @change="handleChange"
            >
              <a-button>
                <a-icon type="upload" />Click to Upload
              </a-button>
            </a-upload>
          </span>
        </p>
        <p style="text-align:right">
          <a-button type="primary">Submit</a-button>
        </p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      info: {}
    };
  },
  created() {
    this.info = this.$route.params.info;
    this.info.agm_date = moment(this.info.agm_date, "YYYY-MM-DD");
  },
  methods: {
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
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