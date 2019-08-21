<template>
  <a-drawer
    title="修改/檢視管理費"
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
            <span class="label">單位編號</span>
            <a-input v-model="info.unit_id"></a-input>
          </p>
          <p class="item">
            <span class="label">收費種類</span>
            <a-select v-model="info.type">
              <a-select-option value="冷氣費">冷氣費</a-select-option>
              <a-select-option value="管理費">管理費</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">金額</span>
            <a-input v-model="info.amount"></a-input>
          </p>
          <p class="item">
            <span class="label">繳付狀態</span>
            <a-select v-model="info.payment_status">
              <a-select-option value="已茲收">已茲收</a-select-option>
              <a-select-option value="未收齊">未收齊</a-select-option>
              <a-select-option value="待確認">待確認</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">繳付方法</span>
            <a-select v-model="info.payment_type">
              <a-select-option value="現金">現金</a-select-option>
              <a-select-option value="支票">支票</a-select-option>
              <a-select-option value="銀行轉帳">銀行轉帳</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">收款日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.receive_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">備註</span>
            <a-input v-model="info.remarks"></a-input>
          </p>
          <a-divider></a-divider>
          <p class="item">
            <span class="label">Unit Fee File</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.unit_fee_file"></uploadFile>
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
import { u_unit_fee } from "@/api/unit_fee";
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
      this.onSubmiting = true;
      this.info.unit_fee_file = this.get_file_info(this.info.unit_fee_file);
      u_unit_fee(this.info)
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

