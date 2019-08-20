<template>
  <a-drawer
    title="Add PMaster Record"
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
            <span class="label">物業狀態</span>
            <a-select v-model="info.status">
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="暫停">暫停</a-select-option>
              <a-select-option value="封存">封存</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">物業種類</span>
            <a-select v-model="info.type">
              <a-select-option value="單棟式大廈">單棟式大廈</a-select-option>
              <a-select-option value="大型屋苑大廈">大型屋苑大廈</a-select-option>
              <a-select-option value="屋苑大廈">屋苑大廈</a-select-option>
              <a-select-option value="商廈">商廈</a-select-option>
              <a-select-option value="寫字樓">寫字樓</a-select-option>
            </a-select>
          </p>
          <p class="item">
            <span class="label">物業中文名稱</span>
            <a-input v-model="info.name_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">物業英文名稱</span>
            <a-input v-model="info.name_en"></a-input>
          </p>
          <p class="item">
            <span class="label">物業中文地址</span>
            <a-input v-model="info.address_zh"></a-input>
          </p>
          <p class="item">
            <span class="label">物業英文地址</span>
            <a-input v-model="info.address_en"></a-input>
          </p>
          <p class="item">
            <span class="label">年度股東大會日期</span>
            <a-date-picker format="DD/MM/YYYY" v-model="info.agm_date"></a-date-picker>
          </p>
          <p class="item">
            <span class="label">落成年份</span>
            <a-input v-model="info.build_year"></a-input>
          </p>
          <p class="item">
            <span class="label">樓層總數</span>
            <a-input v-model="info.floor_amount"></a-input>
          </p>
          <p class="item">
            <span class="label">單位總數</span>
            <a-input v-model="info.unit_amount"></a-input>
          </p>
          <p class="item">
            <span class="label">總面積</span>
            <a-input v-model="info.total_size"></a-input>
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

