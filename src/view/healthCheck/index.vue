<template>
  <div class="gutter-example">
    <a-row>
      <h1>大廈相關人員</h1>
    </a-row>
    <a-row :gutter="16">
      <a-col :key="key" v-for="(obj,key) in entity_list" class="gutter-row" :span="6">
        <a-card :headStyle="{'background-color': obj.color}" :loading="false" :title="obj.title">
          <a-progress type="dashboard" :percent="obj.percent" />
          <a-statistic :value="obj.count" valueClass="demo-class">
            <template v-slot:suffix>
              <span>/ {{obj.threshold}}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <h1>大廈檔案</h1>
    </a-row>
    <a-row :gutter="16">
      <a-col :key="key" v-for="(obj,key) in document_list" class="gutter-row" :span="6">
        <a-card :headStyle="{'background-color': obj.color}" :loading="false" :title="obj.title">
          <a-progress type="dashboard" :percent="obj.percent" />
          <a-statistic :value="obj.count" valueClass="demo-class">
            <template v-slot:suffix>
              <span>/ {{obj.threshold}}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <h1>大廈工程合約</h1>
    </a-row>
    <a-row :gutter="16">
      <a-col :key="key" v-for="(obj,key) in contract_list" class="gutter-row" :span="6">
        <a-card :headStyle="{'background-color': obj.color}" :loading="false" :title="obj.title">
          <a-progress type="dashboard" :percent="obj.percent" />
          <a-statistic :value="obj.count" valueClass="demo-class">
            <template v-slot:suffix>
              <span>/ {{obj.threshold}}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <h1>大廈單位資料</h1>
    </a-row>
    <a-row :gutter="16">
      <a-col :key="key" v-for="(obj,key) in unit_list" class="gutter-row" :span="6">
        <a-card :headStyle="{'background-color': obj.color}" :loading="false" :title="obj.title">
          <a-progress type="dashboard" :percent="obj.percent" />
          <a-statistic :value="obj.count" valueClass="demo-class">
            <template v-slot:suffix>
              <span>/ {{obj.threshold}}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
//entity
import { r_propman } from "@/api/propman.js";
import { r_oc } from "@/api/oc.js";
import { r_contractor } from "@/api/contractor.js";
//Contract
import { r_individual_contract } from "@/api/individual_contract.js";
import { r_individual_contract_work_report } from "@/api/individual_contract_work_report.js";
import { r_term_contract } from "@/api/term_contract.js";
import { r_term_contract_regular_report } from "@/api/term_contract_regular_report.js";
//Unit
import { r_unit_list } from "@/api/unit_list.js";
import { r_unit_file } from "@/api/unit_file.js";
//Document
import { r_notice } from "@/api/notice.js";
import { r_important } from "@/api/important.js";
import { r_minutes } from "@/api/minutes.js";
import { r_insurance_claims } from "@/api/insurance_claims";

class dashobj {
  constructor(title, get_data, threshold, percent, count) {
    this.title = title;
    this.get_data = get_data;
    this.threshold = threshold;
    this.percent = percent;
    this.count = count;
    this.updateobj();
  }

  updateobj() {
    this.set_percent();
    this.set_color();
  }

  set_percent() {
    this.percent = Math.ceil((this.count / this.threshold) * 100);
  }

  set_color() {
    if (this.count / this.threshold >= 1) {
      this.color = "green";
    } else if (this.count / this.threshold > 0) {
      this.color = "yellow";
    } else {
      this.color = "red";
    }
  }
}

export default {
  data() {
    return {
      entity_list: [],
      contract_list: [],
      unit_list: [],
      document_list: [],
      property_id: "",
      loading: true,
      entity_threshold: 10,
      document_threshold: 5,
      contract_threshold: 6,
      unit_threshold: 20
    };
  },
  components: {},
  created() {
    this.property_id = this.$route.params.bid;
    this.entity_list = [
      new dashobj(
        "物管人員",
        r_propman(this.property_id),
        this.entity_threshold,
        0,
        0
      ),
      new dashobj(
        "法團成員",
        r_oc(this.property_id),
        this.entity_threshold,
        0,
        0
      ),
      new dashobj(
        "承辦商",
        r_contractor(this.property_id),
        this.entity_threshold,
        0,
        0
      )
    ];
    this.document_list = [
      new dashobj(
        "大廈通告",
        r_notice(this.property_id),
        this.document_threshold,
        0,
        0
      ),
      new dashobj(
        "政府法令",
        r_important(this.property_id),
        this.document_threshold,
        0,
        0
      ),
      new dashobj(
        "會議紀錄",
        r_minutes(this.property_id),
        this.document_threshold,
        0,
        0
      ),
      new dashobj(
        "保險索償",
        r_insurance_claims(this.property_id),
        this.document_threshold,
        0,
        0
      )
    ];
    this.contract_list = [
      new dashobj(
        "常規合約",
        r_term_contract(this.property_id),
        this.contract_threshold,
        0,
        0
      ),
      new dashobj(
        "常規合約 - 檢查報告",
        r_term_contract_regular_report(this.property_id),
        this.contract_threshold,
        0,
        0
      ),
      new dashobj(
        "一次性合約",
        r_individual_contract(this.property_id),
        this.contract_threshold,
        0,
        0
      ),
      new dashobj(
        "一次性合約 - 工作報告",
        r_individual_contract_work_report(this.property_id),
        this.contract_threshold,
        0,
        0
      )
    ];
    this.unit_list = [
      new dashobj(
        "單位列表",
        r_unit_list(this.property_id),
        this.unit_threshold,
        0,
        0
      ),
      new dashobj(
        "單位檔案",
        r_unit_file(this.property_id),
        this.unit_threshold,
        0,
        0
      )
    ];
    this.getInfo(this.entity_list);
    this.getInfo(this.document_list);
    this.getInfo(this.contract_list);
    this.getInfo(this.unit_list);
  },
  methods: {
    //獲取property info
    getInfo(list) {
      Promise.all(list.map(({ get_data }) => get_data))
        .then(res => {
          console.log(res);
          res.forEach((element, index) => {
            list[index].count = element.list.length;
            list[index].updateobj();
          });
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<style lang="scss">
.gutter-example >>> .ant-row > div {
  background: transparent;
  border: 0;
}
.gutter-box {
  background: #00a0e9;
  padding: 5px 0;
}
</style>