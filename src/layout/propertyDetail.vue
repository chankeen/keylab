<template>
  <div class="buildingDetail-container">
    <a-layout style="height:100%">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
          <a-menu-item v-for="(item,i) in memu" :key="item.r_name" @click="onMenuSelect(item)">
            <a-icon :type="item.icon"></a-icon>
            <span>{{item.title}}</span>
          </a-menu-item>
          <a-menu-item key="back" @click="()=>{
               $router.go(-1)
           }">
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
            @click="()=> collapsed = !collapsed"
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
        { r_name: "property_management", title: "物管人員", icon: "team" },
        { r_name: "property_firm", title: "法團成員", icon: "team" }
      ],
      breadcrumb: [],
      activeItem: ["client_list"],
      collapsed: false,
      headTitle: ""
    };
  },
  created() {
    this.headTitle = this.$route.params.info.name_en;
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
      if (item.r_name == "property_home") {
        this.$router.push({ name: item.r_name });
        this.breadcrumb = [];
        this.breadcrumb.push("Home");
        this.breadcrumb.push(item.title);
      } else {
        this.$message.info("開發中");
      }
    },
    admin_logout() {
      logout()
        .then(res => {
          if (res.status) {
            sessionStorage.token = "";
            this.$router.push({ path: "/login" });
          } else {
            this.$message.error("登出失敗");
          }
        })
        .catch(err => {});
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
