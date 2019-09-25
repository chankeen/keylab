<template>
  <a-drawer
    title="新增法團命令"
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
            <span class="label">政府法令種類</span>
            <a-select v-model="info.type">
              <a-select-option value="---">--- 請選擇種類 ---</a-select-option>
              <a-select-option value="食環署">食環署</a-select-option>
              <a-select-option value="土木工程署">土木工程署</a-select-option>
              <a-select-option value="屋宇署">屋宇署</a-select-option>
              <a-select-option value="消防署">消防署</a-select-option>
              <a-select-option value="機電工程署">機電工程署</a-select-option>
              <a-select-option value="法律訴頌">法律訴頌</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">知悉日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.known_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">參考編號</span>
            <a-input format="DD/MM/YYYY" v-model="info.ref_no"></a-input>
          </p>
          <p class="item">
            <span class="label">處理限期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.deadline"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">政府法令內容</span>
            <a-input placeholder="任意填寫" v-model="info.content"></a-input>
          </p>
          <p class="item">
            <span class="label">法令負責人</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectUser.showModal('',[])
              }"
            >Search</a-button>
          </p>
          <p class="item">
            <span class="label">中文名稱</span>
            <a-input readonly v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">英文名稱</span>
            <a-input readonly v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">電話號碼</span>
            <a-input readonly v-model="info.login_tel"></a-input>
          </p>
          <a-divider></a-divider>
          <p class="item">
            <span class="label">相關文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="importantFile" v-model="info.important_file"></uploadFile>
            </span>
          </p>
          <a-divider />
        </a-col>
        <selectUser :selectType="'radio'" ref="selectUser" @done="onUserSelect"></selectUser>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFile from "@/components/uploadFile";
import selectUser from "@/components/selectUser";
import { c_important } from "@/api/important";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        type: "",
        known_date: "",
        deadline: "",
        content: "",
        remarks: "",
        important_file: [],
        handler_user_id: "",
        name_zh: "",
        name_en: "",
        login_tel: ""
      }
    };
  },
  components: { uploadFile, selectUser },
  created() {},
  methods: {
    onUserSelect(e) {
      console.log(e.list[e.selectedRowKeys[0]]);
      this.info.handler_user_id = e.selectedRowKeys[0];
      this.info.name_zh = e.list[e.selectedRowKeys[0]].name_zh;
      this.info.name_en = e.list[e.selectedRowKeys[0]].name_en;
      this.info.login_tel = e.list[e.selectedRowKeys[0]].login_tel;
    },
    show() {
      this.info.type = "---";
      this.info.known_date = null;
      this.info.deadline = null;
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      submit_info.known_date = submit_info.known_date._isValid
        ? submit_info.known_date.format("YYYY-MM-DD")
        : "";
      submit_info.deadline = submit_info.deadline._isValid
        ? submit_info.deadline.format("YYYY-MM-DD")
        : "";
      submit_info.important_file = this.$refs.importantFile.get_file_info(
        submit_info.important_file
      );
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_important(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api return - " + res.error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("添加失敗 - system error - " + err);
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

