<template>
  <a-modal v-model="visible" :footer="null" title="報價單" width="1000px">
    <div class="created_invitation">
      <p class="item">
        <span class="label">工程單號</span>
        <a-select v-model="info.p_no" @change="onSelect">
          <a-select-option
            v-for="(item,i) in pmaster_list"
            :key="i"
            :value="item.p_no"
          >{{item.p_no}}</a-select-option>
        </a-select>
      </p>
      <p class="item">
        <span class="label">送呈</span>
        <a-input v-model="pmaster.ccn" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">寄送地址</span>
        <a-input v-model="pmaster.bt" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">致</span>
        <a-input v-model="pmaster.ccp" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">電話</span>
        <a-input v-model="pmaster.ct" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">傳真</span>
        <a-input v-model="pmaster.cf" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">電郵</span>
        <a-input v-model="pmaster.ce" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">日期</span>
        <a-date-picker v-model="info.date" format="DD/MM/YYYY"></a-date-picker>
      </p>
      <p class="item">
        <span class="label">工程地點</span>
        <a-input v-model="pmaster.jca" disabled="true"></a-input>
      </p>
      <p class="item">
        <span class="label">主旨</span>
        <a-input v-model="title" disabled="true"></a-input>
      </p>
      <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false">
        <template slot="describe" slot-scope="text,record">
          <a-textarea v-model="record.describe"></a-textarea>
        </template>
        <template slot="count" slot-scope="text,record">
          <a-input v-model="record.count" type="number"></a-input>
        </template>
        <template slot="price" slot-scope="text,record">
          <a-input v-model="record.price" type="number"></a-input>
        </template>
        <template slot="total" slot-scope="text,record">
          {{
          record|get_total
          }}
        </template>
        <template slot="footer" slot-scope="currentPageData">
          <p style="text-align:right">
            總金額：${{
            dataSource|get_sum
            }}
          </p>
        </template>
      </a-table>

      <a :href="file_link" ref="download" hidden>下載</a>
      <p style="text-align:right;margin-top:10px">
        <a-button
          type="primary"
          @click="exportForm"
          :disabled="enableExportBtn"
          :loading="created_form_loading"
        >export</a-button>
      </p>
    </div>
  </a-modal>
</template>
<script>
import { created_q_form } from "@/api/form.js";
const columns = [
  { title: "項目", dataIndex: "project", key: "1" },
  {
    title: "工程描述",
    width: "400px",
    dataIndex: "describe",
    key: "2",
    scopedSlots: { customRender: "describe" }
  },
  {
    title: "數量",
    dataIndex: "count",
    key: "3",
    scopedSlots: { customRender: "count" }
  },
  { title: "單位", dataIndex: "unit", key: "4" },
  {
    title: "單價",
    dataIndex: "price",
    key: "5",
    scopedSlots: { customRender: "price" }
  },
  {
    title: "金額",
    key: "6",
    scopedSlots: { customRender: "total" }
  }
];
function sum(data) {
  return data.reduce(
    (sum, current) => sum + parseInt(current.price) * parseInt(current.count),
    0
  );
}
export default {
  data() {
    return {
      dataSource: [
        {
          project: "1",
          describe: "",
          count: "1",
          unit: "單",
          price: "0",
          total: "0"
        },
        {
          project: "2",
          describe: "",
          count: "1",
          price: "0",
          unit: "單",
          total: "0"
        },
        {
          project: "3",
          describe: "",
          count: "1",
          price: "0",
          unit: "單",
          total: "0"
        }
      ],
      columns: columns,
      visible: false,
      created_form_loading: false,
      pmaster_list: [],
      pmaster: {}, //選中的pmaster
      file_link: "",
      info: {
        p_no: "",
        date: ""
      },
      title: ""
    };
  },

  created() {},
  methods: {
    show(list) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      for (const key in this.pmaster) {
        if (this.pmaster.hasOwnProperty(key)) {
          this.pmaster[key] = "";
        }
      }
      this.title = "";
      this.pmaster_list = list;
      this.visible = true;
    },
    onSelect(e) {
      this.pmaster_list.some(item => {
        if (item.p_no == e) {
          this.pmaster = item;
          this.pmaster = JSON.parse(JSON.stringify(item));
          this.title = this.pmaster.pl + "-" + this.pmaster.pt;
          return true;
        }
      });
    },
    exportForm() {
      let values = {};
      for (const key in this.info) {
        let date = "";
        if (typeof this.info[key] == "object") {
          date = this.info[key]._isValid
            ? this.info[key].format("DD/MM/YYYY")
            : "";
          values[key] = date;
          continue;
        }
        values[key] = this.info[key];
      }

      values.project = JSON.stringify(this.dataSource);
      values.total = sum(this.dataSource);
      this.created_form_loading = true;
      created_q_form(values)
        .then(res => {
          console.log(res);
          this.created_form_loading = false;
          this.file_link = res.link;
          this.$nextTick(function() {
            this.$refs.download.click();
          });
        })
        .catch(err => {
          this.created_form_loading = false;
        });
    }
  },
  filters: {
    get_total: function(record) {
      record.total = record.price * record.count;
      return "$" + record.price * record.count;
    },
    get_sum: function(data) {
      return sum(data);
    }
  },
  computed: {
    enableExportBtn: function() {
      return this.info.p_no == "";
    }
  }
};
</script>
<style lang="scss">
.created_invitation {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      min-width: 170px;
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

