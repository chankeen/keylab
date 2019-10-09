<template>
  <a-drawer
    title="新增單位紀錄"
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
            <span class="label required">從單位例表中揀選</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectUnitList.showModal('',this.$route.params.bid)
              }"
            >Search</a-button>
          </p>
          <p class="item" v-if="info.unit_id != ''">
            <span class="label">座數</span>
            <a-input readonly v-model="info.block"></a-input>
          </p>
          <p class="item" v-if="info.unit_id != ''">
            <span class="label">樓層</span>
            <a-input readonly v-model="info.floor"></a-input>
          </p>
          <p class="item" v-if="info.unit_id != ''">
            <span class="label">單位</span>
            <a-input readonly v-model="info.unit"></a-input>
          </p>
          <p class="item">
            <span class="label required">紀錄種類</span>
            <a-select v-model="info.type">
              <!-- <a-select-option value="投訴">投訴</a-select-option> -->
              <a-select-option value="欠其他款項">欠其他款項</a-select-option>
              <a-select-option value="管理費按金">管理費按金</a-select-option>
              <a-select-option value="法律問題">法律問題</a-select-option>
              <a-select-option value="裝修申請">裝修申請</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">文書日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.instrument_date"></a-date-picker>
          </p>
          <a-divider></a-divider>
          <p class="item">
            <span class="label">相關文件</span>
            <span style="text-align:left;width:100%">
              <uploadFile ref="uploadFile" v-model="info.unit_file_file"></uploadFile>
            </span>
          </p>
          <a-divider />
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
    <selectUnitList :selectType="'radio'" ref="selectUnitList" @done="onUnitListSelect"></selectUnitList>
  </a-drawer>
</template>
<script>
import moment from "moment";
import selectUnitList from "@/components/selectUnitList";
import uploadFile from "@/components/uploadFile.vue";
import { c_unit_file } from "@/api/unit_file";
import { isHasVal, isArray } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      submit_info: {},
      info: {
        property_id: "",
        unit_id: "",
        instrument_date: null,
        unit_file_file: [],
        remarks: "",
        type: ""
      }
    };
  },
  created() {},
  components: { selectUnitList, uploadFile },
  methods: {
    onUnitListSelect(e) {
      console.log(e);
      this.info.unit_id = e.unit_id;
      this.info.block = e.block;
      this.info.floor = e.floor;
      this.info.unit = e.unit;
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.info.type = "欠其他款項";
      this.info.instrument_date = null;
      this.info.unit_file_file = [];
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    handle_submit_data(submit_info) {
      //submit info data handling
      var date_property = ["instrument_date"];

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

      submit_info.unit_file_file = this.$refs.uploadFile.get_file_info(
        submit_info.unit_file_file
      );
      submit_info.property_id = this.$route.params.bid;
      return submit_info;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["unit_id", "type"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (isArray(this.info[mandatory_property[i]])) {
            if (!this.info[mandatory_property[i]].length > 0) {
              this.$message.error("請上載至少1個檔寨");
              return false;
            }
          } else {
            if (!isHasVal(this.info[mandatory_property[i]])) {
              this.$message.error("請檢查必須填寫的資料");
              return false;
            }
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
      c_unit_file(this.handle_submit_data(this.submit_info))
        .then(res => {
          if (res.status) {
            this.$message.success("成功添加");
            this.visible = false;
            this.$emit("done", {});
          } else {
            this.$message.error("添加失敗 - api return - " + res.error);
          }
        })
        .catch(err => {
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

