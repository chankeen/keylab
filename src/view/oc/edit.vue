<template>
  <a-modal title="Edit OC Record" @close="onClose" v-model="visible" width="600px" :footer="null">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label">物業編號</span>
            <a-select v-model="info.property_id"></a-select>
          </p>
          <p class="item">
            <span class="label">名稱(中文)</span>
            <a-input v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">名稱(英文)</span>
            <a-input v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">職位</span>
            <a-input v-model="info.position"></a-input>
          </p>
          <p class="item">
            <span class="label">Year From</span>
            <a-input v-model="info.year_from"></a-input>
          </p>
          <p class="item">
            <span class="label">Year To</span>
            <a-input v-model="info.year_to"></a-input>
          </p>
          <p class="item">
            <span class="label">Term</span>
            <a-input v-model="info.term"></a-input>
          </p>
          <p class="item">
            <span class="label">Elected Date</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.elected_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">Introduction</span>
            <a-input v-model="info.introduction"></a-input>
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
import { get_client_data } from "@/api/client_data";
import { new_pmaster } from "@/api/property";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        property_id: "",
        name_zh: "",
        name_en: "",
        position: "",
        year_from: "",
        year_to: "",
        term: "",
        elected_date: "",
        introduction: ""
      }
    };
  },
  created() {
    this.get_client();
  },
  methods: {
    show(info) {
      this.info = info;
      this.info.elected_date = moment(this.info.elected_date, "YYYY-MM-DD");
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
      new_pmaster(this.info)
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

