<template>
  <div class="buildingDetail-container">
    <a-layout style="height:100%">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed" :style="menu_style">
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['property_home']">
          <a-menu-item v-for="(item,i) in memu" :key="item.r_name" @click="onMenuSelect(item)">
            <a-icon :type="item.icon"></a-icon>
            <span>{{item.title}}</span>
          </a-menu-item>
          <a-menu-item
            key="back"
            @click="()=>{
               $router.push({name:'home'})
           }"
          >
            <a-icon type="arrow-left"></a-icon>
            <span>Back To Home</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="()=>{
               collapsed = !collapsed
               let width = '';
                if(collapsed){
                  //关
                 width = 80;
                }else{
                 //开
                   width = 300;
                }
                 this.menu_style.flex = '0 0 '+width+'px';
                 this.menu_style.width = width+'px';
                 this.menu_style['max-width'] = width+'px';
            
            }"
          />
          <span class="head_title">{{headTitle}}</span>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item
                key="3"
                @click="()=>{
                admin_logout();
                
                }"
              >
                <a-icon type="arrow-left" />登出
              </a-menu-item>
            </a-menu>
            <p class="user">
              <a-icon type="user" />
            </p>
          </a-dropdown>
        </a-layout-header>
        <a-layout-content :style="{ height: '100vh', margin: '24px 16px 0', overflow: 'initial' }">
          <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import { logout } from "@/api/user.js";
export default {
  data() {
    return {
      memu: [
        { r_name: "property_home", title: "大廈詳情", icon: "info-circle" },
        {
          r_name: "property_propman",
          title: "Propman / 物管人員",
          icon: "team"
        },
        { r_name: "property_oc", title: "Oc / 法團成員", icon: "team" },
        {
          r_name: "property_contractor",
          title: "Contractor / 承辦商",
          icon: "tool"
        },
        {
          r_name: "property_notice",
          title: "Notice / 大廈通告",
          icon: "file-text"
        },
        {
          r_name: "property_important",
          title: "Important / 政府法令",
          icon: "exclamation-circle"
        },
        {
          r_name: "property_minutes",
          title: "Minutes / 會議紀錄",
          icon: "solution"
        },
        {
          r_name: "property_unit_list",
          title: "Unit List / 單位列表",
          icon: "block"
        },
        // {
        //   r_name: "property_unit_fee",
        //   title: "Unit Fee / 管理費",
        //   icon: "pay-circle"
        // },
        {
          r_name: "property_unit_file",
          title: "Unit File / 單位紀錄",
          icon: "ordered-list"
        },
        {
          r_name: "property_term_contract",
          title: "Term Contract / 常規合約",
          icon: "file-sync"
        },
        {
          r_name: "property_individual_contract",
          title: "Individual Contract / 一次性合約",
          icon: "file-exclamation"
        }
      ],
      breadcrumb: [],
      activeItem: ["client_list"],
      collapsed: false,
      headTitle: "",
      menu_style: {},
      memu_300: {
        flex: "0 0 300px",
        "max-width": "300px",
        "min-width": "0px",
        width: "300px",
        overflow: "auto",
        height: "100vh"
      },
      memu_80: {
        flex: "0 0 80px",
        "max-width": "80px",
        "min-width": "0px",
        width: "80px !important",
        overflow: "auto",
        height: "100vh"
      }
    };
  },
  created() {
    this.menu_style = this.memu_300;
    this.headTitle = this.$route.params.info.name_zh;
    //麵包屑
    this.breadcrumb.push("Home");
    this.memu.some(item => {
      if (this.$route.name == item.r_name) {
        this.breadcrumb.push(item.title);
        this.activeItem[0] = item.r_name;
        return true;
      }
    });
  },
  methods: {
    //菜單欄選擇
    onMenuSelect(item) {
      this.$router.push({ name: item.r_name });
      this.breadcrumb = [];
      this.breadcrumb.push("Home");
      this.breadcrumb.push(item.title);
      // if (
      //   item.r_name == "property_home" ||
      //   item.r_name == "property_important"
      // ) {

      // } else {
      //   this.$message.info("開發中");
      // }
    },
    admin_logout() {
      sessionStorage.token = "";
      this.$message.success("登出成功");
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style lang="scss">
.buildingDetail-container {
  height: 100%;
  background: #f0f2f5;
  .head_title {
    font-size: 1.6em;
  }
  .trigger {
    font-size: 24px;
  }
  .user {
    cursor: pointer;
    width: auto;
    height: 31px;
    font-size: 25px;
    padding: 3px 8px;
    float: right;
    margin: 16px 16px 16px 0;
    line-height: 100%;
    background: rgba(255, 255, 255, 0.2);
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    color: black;
    text-align: center;
  }

  .ant-breadcrumb-link {
    font-weight: 600;
  }
}
</style>
