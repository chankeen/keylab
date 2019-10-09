<template>
  <a-modal title="新增相關人員/ 公司" :afterClose="onClose" v-model="visible" width="600px" :footer="null">
    <div class="new-pmaster-modal">
      <a-row>
        <a-col>
          <p class="item">
            <span class="label required">從物管人員, 法團成員和承辦商中揀選</span>
            <a-button
              type="primary"
              icon="search"
              @click="()=>{
              $refs.selectRelatedEntity.showModal('related_id',[],this.$route.params.bid)
              }"
            >Search</a-button>
          </p>
          <p class="item" v-if="info.related_id != ''">
            <span class="label">中文名稱</span>
            <a-input readonly v-model="info.name_zh" disabled></a-input>
          </p>
          <p class="item" v-if="info.related_id != ''">
            <span class="label">種類</span>
            <a-input readonly v-model="info.display_type" disabled></a-input>
          </p>
          <p class="item">
            <span class="label">合約角色</span>
            <a-input placeholder="請填寫該人員/ 公司在合約擔當的角色" v-model="info.role"></a-input>
          </p>
        </a-col>
      </a-row>
      <p style="text-align:right">
        <a-button type="primary" :loading="onSubmiting" @click="submit_validation">Submit</a-button>
      </p>
    </div>
    <selectRelatedEntity
      :selectType="'radio'"
      ref="selectRelatedEntity"
      @done="onRelatedEntitySelect"
    ></selectRelatedEntity>
  </a-modal>
</template>
<script>
import { c_term_contract_related_entity } from "@/api/term_contract_related_entity";
import { c_individual_contract_related_entity } from "@/api/individual_contract_related_entity";
import selectRelatedEntity from "@/components/selectRelatedEntity";
import { isHasVal } from "@/utils/validate";

export default {
  data() {
    return {
      visible: false,
      onSubmiting: false,
      info: {
        display_type: "",
        name_zh: "",
        related_id: "",
        type: "",
        role: ""
      }
    };
  },
  props: ["contracttype", "contractid"],
  components: { selectRelatedEntity },
  created() {},
  methods: {
    onRelatedEntitySelect(e) {
      console.log(e);
      if (e.hasOwnProperty("related_id")) {
        this.info.display_type = e.display_type;
        this.info.type = e.type;
        this.info.related_id = e.related_id;
        this.info.name_zh = e.name_zh;
        this.info.login_tel = e.login_tel;
      }
    },
    show() {
      for (const key in this.info) {
        if (this.info.hasOwnProperty(key) && !Array.isArray(this.info[key])) {
          this.info[key] = "";
        }
      }
      this.visible = true;
      this.onSubmiting = false;
    },
    onClose() {
      this.visible = false;
    },
    submit_validation() {
      //check mandatory
      var mandatory_property = ["related_id"];
      for (let i = 0; i < mandatory_property.length; i++) {
        console.log(mandatory_property[i]);
        console.log(this.info.hasOwnProperty(mandatory_property[i]));
        if (this.info.hasOwnProperty(mandatory_property[i])) {
          if (!isHasVal(this.info[mandatory_property[i]])) {
            this.$message.error("請檢查必須填寫的資料");
            return false;
          }
        } else {
          this.$message.error("mandatory status wrong");
          return false;
        }
      }
      return this.onSubmit();
    },
    onSubmit() {
      this.onSubmiting = true;
      if (this.contracttype == "term") {
        this.info.term_contract_id = this.contractid;
        c_term_contract_related_entity(this.info)
          .then(res => {
            if (res.status) {
              this.$message.success("成功添加");
              this.visible = false;
              this.$emit("submit");
            } else {
              this.$message.error("添加失敗");
            }
            this.onSubmiting = false;
          })
          .catch(err => {
            this.onSubmiting = false;
            this.$message.error("server error - 添加失敗");
          });
      } else if (this.contracttype == "individual") {
        this.info.individual_contract_id = this.contractid;
        c_individual_contract_related_entity(this.info)
          .then(res => {
            if (res.status) {
              this.$message.success("成功添加");
              this.visible = false;
              this.$emit("submit");
            } else {
              this.$message.error("添加失敗");
            }
            this.onSubmiting = false;
          })
          .catch(err => {
            this.onSubmiting = false;
            this.$message.error("server error - 添加失敗");
          });
      } else {
        this.$message.error("添加失敗 - Type error");
        this.onSubmiting = false;
      }
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
