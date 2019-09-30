<template>
  <!-- <a-button type="primary" @click="onDelete(entity.related_entity_id)">新增相關人員/ 公司</a-button> -->
  <a-collapse>
    <a-collapse-panel
      v-if="entity_List.length > 0"
      style="margin-top:5px;margin-bottom:5px"
      :header="(entity.type)+' - '+(entity.name_zh)"
      v-for="(entity,index) in entity_List"
      :key="index"
    >
      <p class="item">
        <span class="label">相關人員/ 公司中文名</span>
        <a-input readonly :value="entity.name_zh"></a-input>
      </p>
      <p class="item">
        <span class="label">相關人員/ 公司電話</span>
        <a-input readonly :value="entity.login_tel"></a-input>
      </p>
      <p class="item">
        <span class="label">相關人員/ 公司在此合約的角色</span>
        <span style="text-align:left;width:100%">
          <a-input readonly :value="entity.role"></a-input>
        </span>
      </p>
      <p style="text-align:right">
        <a-button
          type="primary"
          @click="deleteEntity(entity.term_contract_related_entity_id)"
        >Delete</a-button>
      </p>
    </a-collapse-panel>
    <a-collapse-panel v-if="entity_List.length == 0" disabled :header="'沒有相關人員紀錄'" :key="0"></a-collapse-panel>
  </a-collapse>
</template>

<script>
import { d_term_contract_related_entity } from "@/api/term_contract_related_entity";
export default {
  data() {
    return {
      entity_List: []
    };
  },
  props: ["value"],
  created() {},
  methods: {
    deleteEntity(term_contract_related_entity_id) {
      d_term_contract_related_entity(term_contract_related_entity_id)
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
    }
  },
  watch: {
    value: {
      //監視外面的變化 更新component 模樣
      immediate: true,
      handler(nval, oval) {
        console.log("entity handler");
        console.log("old value:");
        console.log(oval);
        console.log("new value:");
        console.log(nval);
        this.entity_List = nval;
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
