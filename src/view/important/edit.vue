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
          <p class="item">
            <span class="label">重要事項編號</span>
            <a-input v-model="info.important_id"></a-input>
          </p>
          <p class="item">
            <span class="label">重要事項種類</span>
            <a-select v-model="info.type">
              <a-select-option value="政府法令">政府法令</a-select-option>
              <a-select-option value="其他事項">其他事項</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">知悉日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.known_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">限期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.deadline"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">重要事項內容</span>
            <a-input v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <a-input v-model="info.remarks"></a-input>
          </p>
          <a-divider></a-divider>
          <p class="item">
            <span class="label">Important File</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.important_file"></uploadFile>
            </span>
          </p>
          <a-divider />
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
import { u_important } from "@/api/important";
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
  components: { uploadFile },
  methods: {
    show(info) {
      this.info = JSON.parse(JSON.stringify(info));
      this.info.known_date = moment(this.info.known_date, "YYYY-MM-DD");
      this.info.deadline = moment(this.info.deadline, "YYYY-MM-DD");
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    //提取文件信息
    get_file_info(item) {
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
        if (this.info.hasOwnProperty(key) && !Array.isArray(this.info[key])) {
          if (typeof this.info[key] == "object") {
            this.info[key] = this.info[key]._isValid
              ? this.info[key].format("YYYY-MM-DD")
              : "";
          }
        }
      }
      this.onSubmiting = true;
      this.info.important_file = this.get_file_info(this.info.important_file);
      u_important(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("修改成功");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("修改失敗");
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("修改失敗");
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

