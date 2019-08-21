<template>
  <a-modal title="PMaster Info" :footer="null" v-model="visible" width="1200px">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col span="11">
          <p class="item">
            <span class="label">工程單編號</span>
            <a-input disabled="true" v-model="info.p_no"></a-input>
          </p>
          <p class="item">
            <span class="label">排序</span>
            <a-input v-model="info.sort"></a-input>
          </p>
          <p class="item">
            <span class="label">工程地址短寫</span>
            <a-input v-model="info.pshort"></a-input>
          </p>
          <p class="item">
            <span class="label">工程地點</span>
            <a-input v-model="info.pl"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶</span>
            <a-input v-model="this.info.ccn" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">負責同事</span>
            <a-input v-model="this.info.sales_code" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">SITE location</span>
            <a-input v-model="this.info.jca" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">BILL TO</span>
            <a-input v-model="this.info.bt" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶聯絡電話</span>
            <a-input v-model="this.info.ct" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶傳真號碼</span>
            <a-input v-model="this.info.cf" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶電郵</span>
            <a-input v-model="this.info.ce" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶聯絡人</span>
            <a-input v-model="this.info.ccp" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">工程標題</span>
            <a-input v-model="info.pt"></a-input>
          </p>
          <p class="item">
            <span class="label">被邀請報價日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.in_price_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">截標日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.end_bid_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">截標時間</span>
            <a-input v-model="info.end_bid_time"></a-input>
          </p>
          <p class="item">
            <span class="label">交標日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.send_bid_date"></a-date-picker>
          </p>
        </a-col>

        <a-col span="11" offset="1">
          <p class="item">
            <span class="label">交標方法</span>
            <a-input v-model="info.send_bid_way"></a-input>
          </p>
          <p class="item">
            <span class="label">出標價錢</span>
            <a-input v-model="info.out_price"></a-input>
          </p>
          <p class="item">
            <span class="label">是否中標</span>
            <span style="width:100%;text-align:left">
              <a-radio-group v-model="info.is_bidding">
                <a-radio :value="'1'">是</a-radio>
                <a-radio :value="'0'">否</a-radio>
              </a-radio-group>
            </span>
          </p>
          <p class="item">
            <span class="label">接收中標日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.re_bidding_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">中標價錢</span>
            <a-input v-model="info.biding_price"></a-input>
          </p>
          <p class="item">
            <span class="label">報價分判名稱</span>
            <a-input v-model="info.sub_price_name"></a-input>
          </p>
          <p class="item">
            <span class="label">分判報價金額</span>
            <a-input v-model="info.sub_price"></a-input>
          </p>
          <p class="item">
            <span class="label">報價單編號或呈報日期</span>
            <a-input v-model="info.spn_date"></a-input>
          </p>
          <p class="item">
            <span class="label">中標分判名稱</span>
            <a-input v-model="info.sub_bid_name"></a-input>
          </p>
          <p class="item">
            <span class="label">接收中標日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.sub_re_bid_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">分判中標價錢</span>
            <a-input v-model="info.sub_bid_price"></a-input>
          </p>
          <p class="item">
            <span class="label">分判中標編號</span>
            <a-input v-model="info.sub_bid_number"></a-input>
          </p>
          <p class="item">
            <span class="label">開工日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.start_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">完工日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.end_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">是否需要小型工程</span>
            <span style="width:100%;text-align:left">
              <a-radio-group v-model="info.min_project">
                <a-radio :value="'1'">是</a-radio>
                <a-radio :value="'0'">否</a-radio>
              </a-radio-group>
            </span>
          </p>
          <p class="item">
            <span class="label">申報記錄BW編號</span>
            <a-input v-model="info.declare_number"></a-input>
          </p>

          <p class="item">
            <span class="label">投標書付款條款</span>
            <a-input v-model="info.regulation"></a-input>
          </p>
        </a-col>
      </a-row>

      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="onSubmint">Submit</a-button>
      </p>
    </div>
  </a-modal>
</template>
<script>
import moment from "moment";
import { getDate } from "@/utils/validate.js";
import { update_pmaster } from "@/api/pmaster.js";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {}
    };
  },
  created() {},
  methods: {
    show(info) {
      this.info = info;
      this.info.in_price_date = getDate(this.info.in_price_date);
      this.info.end_bid_date = getDate(this.info.end_bid_date);
      this.info.send_bid_date = getDate(this.info.send_bid_date);
      this.info.re_bidding_date = getDate(this.info.re_bidding_date);
      this.info.sub_re_bid_date = getDate(this.info.sub_re_bid_date);
      this.info.start_date = getDate(this.info.start_date);
      this.info.end_date = getDate(this.info.end_date);
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onSelect(e) {
      console.log(e);
    },
    onSubmint() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key];
          if (typeof this.info[key] == "object") {
            this.info[key] = this.info[key]._isValid
              ? this.info[key].format("YYYY-MM-DD")
              : "";
          }
        }
      }
      console.log(this.info);
      this.onSubmiting = true;
      update_pmaster(this.info)
        .then(res => {
          this.onSubmiting = false;
          if (res.status) {
            this.$message.success("更新成功");
            this.$emit("done", {});
            this.visible = false;
          } else {
            this.$message.error("更新失敗");
          }
        })
        .catch(err => {
          this.onSubmiting = false;
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

