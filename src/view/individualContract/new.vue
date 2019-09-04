<template>
  <a-drawer
    title="新增一次性合约"
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
            <span class="label">一次性合約編號</span>
            <a-input v-model="info.term_contract_id"></a-input>
          </p>
          <p class="item">
            <span class="label">檢查報告編號</span>
            <a-input v-model="info.regular_report_id"></a-input>
          </p>
          <p class="item">
            <span class="label">狀態</span>
            <a-select v-model="info.status">
              <a-select-option value="招標">招標</a-select-option>
              <a-select-option value="已收報價">已收報價</a-select-option>
              <a-select-option value="合約進行中">合約進行中</a-select-option>
              <a-select-option value="已完成">已完成</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">工程種類</span>
            <a-select v-model="info.type">
              <a-select-option value="冷氣">冷氣</a-select-option>
              <a-select-option value="電梯">電梯</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">招標由</span>
            <a-date-picker v-model="info.tender_start" format="DD/MM/YYYY"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">招標至</span>
            <a-date-picker v-model="info.tender_end" format="DD/MM/YYYY"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">招標金額</span>
            <a-input v-model="info.tender_amount"></a-input>
          </p>
          <p class="item">
            <span class="label">相關工程公司ID</span>
            <a-input
              v-model="info.contractor_user_id"
              readonly
              @click="()=>{
              this.$refs.selectUser.showModal('contractor_user_id',[]);
              }"
            ></a-input>
          </p>
          <p class="item">
            <span class="label">合約文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.contract_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">報價文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile v-model="info.quotation_file"></uploadFile>
            </span>
          </p>
          <p class="item">
            <span class="label">合約內容</span>
            <a-input v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">工程地點</span>
            <a-input v-model="info.location"></a-input>
          </p>
          <p class="item">
            <span class="label">保養期</span>
            <a-input v-model="info.waranty_period"></a-input>
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
import uploadFile from "@/components/uploadFile.vue";
import moment from "moment";
import { c_individual_contract } from "@/api/individual_contract.js";
import selectUser from "@/components/selectUser";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        property_id: "",
        contract_file: [],
        quotation_file: [],
        type: ""
      }
    };
  },
  components: { uploadFile, selectUser },
  created() {},
  methods: {
    onUserSelect(e) {
      this.$set(this.info, e.context, e.selectedRowKeys[0]);
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key) && !Array.isArray(this.info[key])) {
          this.info[key] = "";
        }
      }
      this.info.property_id = this.$route.params.bid;
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    onSubmit() {
      let values = Object.assign();
      // this.onSubmiting = true;
      console.log(this.info);
      //   c_individual_contract(this.info)
      //     .then(res => {
      //       if (res.status) {
      //         this.$message.success("成功添加");
      //         this.visible = false;
      //         this.$emit("done", {});
      //       } else {
      //         this.$message.error("添加失敗");
      //       }
      //       this.onSubmiting = false;
      //     })
      //     .catch(err => {
      //       this.onSubmiting = false;
      //       this.$message.error("server error - 添加失敗");
      //     });
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

