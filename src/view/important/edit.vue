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
            <span class="label">處理死線</span>
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
import { u_important, r_important } from "@/api/important";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        property_id: "",
        type: "",
        known_date: "",
        deadline: "",
        content: "",
        remarks: ""
      }
    };
  },
  created() {
    //this.get_data();
  },
  methods: {
    show(important_id) {
      console.log('importnat_id'+important_id);
      r_important(important_id)
        .then(res => {
          this.info = res.list[0];
        })
        .catch(err => {});
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
      new_property(this.info)
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
    },
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

