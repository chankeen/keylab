<template>
  <a-drawer
    title="延長政府法令期限"
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
            <span class="label required">延期期限</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.deadline"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">相關交件(最大25MB)</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="uploadFile" v-model="info.file"></uploadFile>
            </span>
          </p>
          <p style="text-align:right">
            <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
          </p>
          <a-divider />
          <a-collapse>
            <a-collapse-panel
              v-if="extends_data.length > 0"
              style="margin-top:5px;margin-bottom:5px"
              :header="'延期紀錄 - '+(index+1)"
              v-for="(extend,index) in extends_data"
              :key="index"
            >
              <p class="item">
                <span class="label">延長後期限</span>
                <a-input readonly :value="extend.deadline"></a-input>
              </p>
              <p class="item">
                <span class="label">相關文件</span>
                <span style="text-align:left;width:100%">
                  <uploadFileViewer :value="extend.file"></uploadFileViewer>
                </span>
              </p>
              <p style="text-align:right">
                <a-button type="primary" @click="onDelete(extend.important_deadline_id)">Delete</a-button>
              </p>
            </a-collapse-panel>
            <a-collapse-panel v-if="extends_data.length == 0" disabled :header="'沒有延期紀錄'" :key="0"></a-collapse-panel>
          </a-collapse>
          <a-divider />
        </a-col>
      </a-row>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import uploadFileViewer from "@/components/uploadFileViewer.vue";
import uploadFile from "@/components/uploadFile.vue";
import {
  r_important_deadline,
  d_important_deadline,
  c_important_deadline
} from "@/api/important_deadline";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        file: [],
        deadline: null
      },
      extends_data: []
    };
  },
  created() {
    console.log("extendDeadline created");
  },
  components: { uploadFileViewer, uploadFile },
  methods: {
    show(important_id) {
      console.log(important_id);
      this.info.important_id = important_id;
      this.info.deadline = null;
      this.get_deadline_data();
      //this.info.known_date = moment(this.info.known_date, "YYYY-MM-DD");
      this.visible = true;
      this.onSubmiting = false;
    },
    get_deadline_data() {
      r_important_deadline(this.info.important_id)
        .then(res => {
          this.extends_data = res.list;
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("修改失敗 - system error - " + err);
        });
    },
    onClose() {
      this.visible = false;
    },
    onDelete(important_deadline_id) {
      d_important_deadline(important_deadline_id)
        .then(res => {
          if (res.status) {
            this.$message.success("成功刪除");
            this.get_deadline_data();
            this.$emit("done", {});
          } else {
            this.$message.error("刪除失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
          this.$message.error("刪除失敗 - system error - " + err);
        });
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      var date_property = ["deadline"];

      for (let i = 0; i < date_property.length; i++) {
        var check_date = submit_info[date_property[i]];
        console.log(check_date);
        if (check_date != null) {
          check_date = check_date._isValid
            ? check_date.format("YYYY-MM-DD")
            : "";
        } else {
          check_date = "";
        }
        submit_info[date_property[i]] = check_date;
      }

      submit_info.file = this.$refs.uploadFile.get_file_info(submit_info.file);
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["deadline"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (this.info[mandatory_property[i]] == null) {
            this.$message.error("請填寫必要日期");
            return false;
          }
        } else {
          this.$message.error("mandatory status wrong");
          return false;
        }
      }
      return this.onSubmit();
    },
    onSubmit() {
      Object.assign(this.submit_info, this.info);
      this.onSubmiting = true;
      c_important_deadline(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("修改成功");
            this.get_deadline_data();
            this.$emit("done", {});
          } else {
            this.$message.error("修改失敗 - api return - " + res.error);
          }
          this.onSubmiting = false;
        })
        .catch(err => {
          this.onSubmiting = false;
          this.$message.error("修改失敗 - system error - " + err);
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

