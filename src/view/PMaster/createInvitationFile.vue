<template>
  <a-modal v-model="visible" :footer="null" title="Create Invitation For Tender" width="800px">
    <div class="created_invitation">
      <p class="item">
        <span class="label">分包商</span>
        <a-select v-model="info.contractor_id">
          <a-select-option
            v-for="(item,i) in contractor"
            :key="i"
            :value="item.sub_contractor_id"
          >{{item.name}}</a-select-option>
        </a-select>
      </p>
      <p class="item">
        <span class="label">工程單號</span>
        <a-select v-model="info.p_no">
          <a-select-option
            v-for="(item,i) in pmaster_list"
            :key="i"
            :value="item.p_no"
          >{{item.p_no}}</a-select-option>
        </a-select>
      </p>
      <p class="item">
        <span class="label">發出時間</span>
        <a-date-picker v-model="info.send_date"></a-date-picker>
      </p>
      <p class="item">
        <span class="label">發出方式</span>
        <a-select v-model="info.send_way">
          <a-select-option value=" ">-</a-select-option>
          <a-select-option value="電郵">電郵</a-select-option>
          <a-select-option value="傳真">傳真</a-select-option>
          <a-select-option value="傳真+電郵">傳真+電郵</a-select-option>
          <a-select-option value="Whatsapp by Sales">Whatsapp by Sales</a-select-option>
        </a-select>
      </p>
      <p class="item">
        <span class="label">工程是否屬於小型工程</span>
        <span style="width:100%;text-align:left">
          <a-radio-group v-model="info.is_min_project">
            <a-radio :value="'1'">是</a-radio>
            <a-radio :value="'0'">否</a-radio>
          </a-radio-group>
        </span>
      </p>
      <p class="item">
        <span class="label">工程負責人:</span>
        <a-input v-model="info.p_contact"></a-input>
      </p>
      <p class="item">
        <span class="label">電話:</span>
        <a-input v-model="info.p_contact_tell"></a-input>
      </p>
      <p class="item" v-show="info.is_min_project=='1'">
        <span class="label">小型工程級別項目及編號:</span>
        <a-input v-model="info.p_min_no_level"></a-input>
      </p>
      <p class="item">
        <span class="label">預計所需施工期:</span>
        <a-input v-model="info.finish_days"></a-input>
      </p>
      <p class="item">
        <span class="label">發判商備註(如有):</span>
        <a-input v-model="info.remark1"></a-input>
      </p>
      <p class="item">
        <span class="label">分包商備註(如有):</span>
        <a-input v-model="info.remark2"></a-input>
      </p>
      <a :href="file_link" ref="download" hidden>下載</a>
      <p style="text-align:right">
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
import { get_sub_contractor } from "@/api/pmaster.js";
import { created_in_form } from "@/api/form.js";
export default {
  data() {
    return {
      visible: false,
      contractor: [],
      created_form_loading: false,
      pmaster_list: [],
      file_link: "",
      info: {
        p_no: "",
        contractor_id: "",
        send_date: "",
        send_way: "",
        is_min_project: "",
        p_contact: "",
        p_contact_tell: "",
        p_min_no_level: "",
        finish_days: "",
        remark1: "",
        remark2: ""
      }
    };
  },

  created() {
    this.get_contractor();
  },
  methods: {
    get_contractor() {
      get_sub_contractor()
        .then(res => {
          console.log(res.list);
          this.contractor = res.list;
        })
        .catch(err => {});
    },
    show(list) {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key)) {
          this.info[key] = "";
        }
      }
      this.pmaster_list = list;
      this.visible = true;
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
      this.created_form_loading = true;
      created_in_form(values)
        .then(res => {
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
  computed: {
    link: function() {
      let link = "http://34.92.191.50/export-eso-in/?";
      for (const key in this.info) {
        let date = "";
        if (typeof this.info[key] == "object") {
          date = this.info[key]._isValid
            ? this.info[key].format("DD/MM/YYYY")
            : "";
          link += `&${key}=${date}`;
          continue;
        }
        if (this.info.hasOwnProperty(key)) {
          link += `&${key}=${this.info[key]}`;
        }
      }
      return link;
    },
    enableExportBtn: function() {
      return this.info.contractor_id == "" || this.info.p_no == "";
    }
  },
  watch: {
    "info.is_min_project": function(nval, oval) {
      if (nval == "0") {
        this.info.p_min_no_level = "";
      }
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

