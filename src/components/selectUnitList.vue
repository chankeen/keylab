<template>
  <span>
    <a-modal title="Select Unit List" v-model="visible" width="1000px" :footer="null">
      <a-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type:this.selectType
        }"
        :columns="columns"
        :rowKey="entity => entity.unit_id"
        :dataSource="tableData"
      ></a-table>
      <p style="margin:0;text-align:right">
        <a-button type="primary" @click="onSure">Select</a-button>
      </p>
    </a-modal>
  </span>
</template>
<script>
import { r_unit_list } from "@/api/unit_list.js";

var columns = [
  { title: "單位編號", dataIndex: "unit_id" },
  { title: "座數", dataIndex: "block" },
  { title: "樓層", dataIndex: "floor" },
  { title: "單位", dataIndex: "unit" }
];

export default {
  data() {
    return {
      tableData: [],
      columns,
      visible: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      context: "",
      search_text: "",
      dataSource: [],
      blocklist: [],
      floorlist: [],
      unitlists: []
    };
  },
  props: ["selectType"],
  created() {},
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    getTableData(property_id) {
      this.loading = true;
      Promise.all([r_unit_list(property_id)])
        .then(res => {
          this.dataSource = res[0].list;
          this.context = this.context || "";
          this.selectedRowKeys = []; //clear select
          this.visible = true;
          this.search_text = "";
          this.dataSource.forEach((unitlist, index) => {
            if (!this.blocklist.some(({ value }) => value === unitlist.block)) {
              this.blocklist.push({
                value: unitlist.block,
                text: unitlist.block
              });
            }
            if (!this.floorlist.some(({ value }) => value === unitlist.floor)) {
              this.floorlist.push({
                value: unitlist.floor,
                text: unitlist.floor
              });
            }
            if (!this.unitlists.some(({ value }) => value === unitlist.unit)) {
              this.unitlists.push({
                value: unitlist.unit,
                text: unitlist.unit
              });
            }
          });
          this.columns = [
            { title: "單位編號", dataIndex: "unit_id" },
            { title: "座數", dataIndex: "block", filters: this.blocklist },
            { title: "樓層", dataIndex: "floor", filters: this.floorlist },
            { title: "單位", dataIndex: "unit", filters: this.unitlists }
          ];
          this.tableData = this.dataSource;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    showModal(context, property_id) {
      this.context = context;
      this.dataSource = [];
      this.getTableData(property_id);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRows);
      this.selectedRowKeys = selectedRowKeys;
    },
    onSure() {
      this.visible = false;
      let list = {};
      this.dataSource.forEach(item => {
        if (this.selectedRowKeys[0] == item.unit_id) {
          list = item;
        }
      });

      this.$emit("done", list);
    }
  }
};
</script>
