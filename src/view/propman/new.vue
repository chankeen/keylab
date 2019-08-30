<template>
  <a-drawer
    title="Add Propman Record"
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
            <span class="label">物業編號</span>
            <a-input v-model="info.property_id"></a-input>
          </p>
          <p class="item">
            <span class="label">User ID</span>
            <a-input
              v-model="info.user_id"
              readonly
              @click="()=>{
              $refs.selectUser.showModal('',[])
              }"
            ></a-input>
          </p>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">職位</span>
            <a-input v-model="info.position"></a-input>
          </p>
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
      <selectUser :selectType="'radio'" ref="selectUser" @done="onUserSelect"></selectUser>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import selectUser from "@/components/selectUser";
import { c_propman } from "@/api/propman";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        property_id: "",
        user_id: "",
        position: "",
        name_zh: "",
        name_en:""
      }
    };
  },
  created() {
    this.get_client();
  },
  components: { selectUser },
  methods: {
    onUserSelect(e) {
      console.log(e.selectedRowKeys[0]);
      this.info.user_id = e.selectedRowKeys[0];
      this.info.name_zh = e.list[e.selectedRowKeys[0]].name_zh;
      this.info.name_en = e.list[e.selectedRowKeys[0]].name_en;
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
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
      c_propman(this.info)
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗");
          }
        })
        .catch(err => {
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

