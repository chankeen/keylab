<!--Key mapping 
 id
 subject
 date
 remarks
 file-->
<template>
  <a-collapse>
    <a-collapse-panel
      v-if="report_list.length > 0"
      style="margin-top:5px;margin-bottom:5px"
      :header="(index+1) + ') ' + report.subject + '  ' + report.date"
      v-for="(report,index) in report_list"
      :key="index"
    >
      <p class="item">
        <span class="label">檢查簡介</span>
        <a-input readonly :value="report.subject"></a-input>
      </p>
      <p class="item">
        <span class="label">檢查日期</span>
        <a-input readonly :value="report.date"></a-input>
      </p>
      <p class="item">
        <span class="label">備註</span>
        <span style="text-align:left;width:100%">
          <a-input readonly :value="report.remarks"></a-input>
        </span>
      </p>
      <p class="item">
        <span class="label">檢查報告檔案</span>
        <span style="text-align:left;width:100%">
          <uploadFileViewer :value="report.file"></uploadFileViewer>
        </span>
      </p>
      <p style="text-align:right">
        <a-button type="primary" @click="deletereport(report.id)">Delete</a-button>
      </p>
    </a-collapse-panel>
    <a-collapse-panel v-if="report_list.length == 0" disabled :header="'沒有檢查報告'" :key="0"></a-collapse-panel>
  </a-collapse>
</template>

<script>
import uploadFileViewer from "@/components/uploadFileViewer.vue";
import { d_term_contract_regular_report } from "@/api/term_contract_regular_report";
import { d_individual_contract_work_report } from "@/api/individual_contract_work_report";

export default {
  data() {
    return {
      report_list: [],
      deletedlist: []
    };
  },
  props: ["value", "contracttype"],
  created() {},
  components: { uploadFileViewer },
  methods: {
    deletereport(selected_id) {
      if (this.contracttype == "term") {
        d_term_contract_regular_report(selected_id)
          .then(res => {
            if (res.status) {
              this.$message.success("成功刪除");
              this.$emit("delete", []);
            } else {
              this.$message.error("刪除失敗 - api return - " + res.error);
            }
          })
          .catch(err => {
            this.$message.error("刪除失敗 - system error - " + err);
          });
      } else if (this.contracttype == "individual") {
        d_individual_contract_work_report(selected_id)
          .then(res => {
            if (res.status) {
              this.$message.success("成功刪除");
              this.$emit("delete", []);
            } else {
              this.$message.error("刪除失敗 - api return - " + res.error);
            }
          })
          .catch(err => {
            this.$message.error("刪除失敗 - system error - " + err);
          });
      } else {
        this.$message.error("刪除失敗 - type error");
      }
    }
  },
  watch: {
    value: {
      //監視外面的變化 更新component 模樣
      immediate: true,
      handler(nval, oval) {
        console.log("report handler");
        console.log("old value:");
        console.log(oval);
        console.log("new value:");
        console.log(nval);
        this.report_list = nval;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.ant-collapse {
  width: 100%;
}
</style>
