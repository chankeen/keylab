<template>
  <a-drawer
    title="Add PMaster Record"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
    width="1200px"
  >
    <div class="new-pmaster-modal">
      <a-row>
        <a-col span="11">
          <p class="item">
            <span class="label">客戶編碼</span>
            <a-select @change="onlsnSelect" v-model="info.client_data_id">
              <a-select-option
                v-for="(item,i) in client_data_list"
                :key="i"
                :value="item.client_data_id"
              >{{item.lsn}}</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">排序</span>
            <a-input v-model="info.sort"></a-input>
          </p>
          <p class="item">
            <span class="label">工程標號</span>
            <a-input v-model="project_no"></a-input>
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
            <a-input v-model="this.select_client_data.ccn" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">負責同事</span>
            <a-input v-model="this.select_client_data.sales_code" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">SITE location</span>
            <a-input v-model="this.select_client_data.jca" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">BILL TO</span>
            <a-input v-model="this.select_client_data.bt" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶聯絡電話</span>
            <a-input v-model="this.select_client_data.ct" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶傳真號碼</span>
            <a-input v-model="this.select_client_data.cf" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶電郵</span>
            <a-input v-model="this.select_client_data.ce" disabled="true"></a-input>
          </p>
          <p class="item">
            <span class="label">客戶聯絡人</span>
            <a-input v-model="this.select_client_data.ccp" disabled="true"></a-input>
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
            <a-input v-model="info.sub_re_bid_date"></a-input>
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
        <a-button type="primary" :loading="onSubmiting" @click="onSubmit">Submit</a-button>
      </p>
    </div>
  </a-drawer>
</template>
<script>
import moment from "moment";
import { get_client_data } from "@/api/client_data";
import { new_pmaster } from "@/api/pmaster";
export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        client_data_id: "",
        sort: "",
        p_no: "",
        pl: "",
        pt: "",
        pshort: "",
        in_price_date: "",
        end_bid_date: "",
        end_bid_time: "",
        send_bid_date: "",
        send_bid_way: "",
        out_price: "",
        is_bidding: "",
        re_bidding_date: "",
        biding_price: "",
        sub_price_name: "",
        sub_price: "",
        spn_date: "",
        sub_bid_name: "",
        sub_re_bid_date: "",
        sub_bid_price: "",
        sub_bid_number: "",
        start_date: "",
        end_date: "",
        min_project: "",
        declare_number: "",
        regulation: ""
      },

      client_data_list: [],
      select_client_data: {} //選中的工程單對應的client data
    };
  },
  created() {
    this.get_client();
  },
  computed: {
    project_no: function() {
      return (
        "19-" +
        this.select_client_data.csn +
        "-" +
        this.info.sort +
        this.select_client_data.sales_code
      );
    }
  },
  methods: {
    show() {
      this.select_client_data = {};
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
    onlsnSelect(key) {
      this.client_data_list.some(item => {
        if (item.client_data_id == key) {
          console.log(item);
          this.select_client_data = item;
          return true;
        }
      });
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
      if (this.info.client_data_id == "") {
        this.$message.error("請選擇客戶");
        return;
      }
      this.info.p_no = this.project_no;
      console.log(this.info);
      this.onSubmiting = true;
      new_pmaster(this.info)
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
    },
    get_client() {
      get_client_data()
        .then(res => {
          console.log(res.list);
          this.client_data_list = res.list;
        })
        .catch(err => {});
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

