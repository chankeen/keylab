<template>
  <div class="home-container">
    <a-layout style="height:100%">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
          <a-menu-item v-for="(item,i) in memu" :key="item.r_name" @click="onMenuSelect(item)">
            <a-icon type="link"></a-icon>
            <span>{{item.title}}</span>
          </a-menu-item>

          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="mail" />
              <span>Navigation One</span>
            </span>
            <a-menu-item key="5">Option 5</a-menu-item>
            <a-menu-item key="6">Option 6</a-menu-item>
            <a-menu-item key="7">Option 7</a-menu-item>
            <a-menu-item key="8">Option 8</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="appstore" />
              <span>Navigation Two</span>
            </span>
            <a-menu-item key="5">Option 5</a-menu-item>
            <a-menu-item key="6">Option 6</a-menu-item>
            <a-menu-item key="7">Option 7</a-menu-item>
            <a-menu-item key="8">Option 8</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="()=> collapsed = !collapsed"
          />
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
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
        >
          <router-view />
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
      memu: [{ r_name: "p_master", title: "P Master" }],
      breadcrumb: [],
      activeItem: ["client_list"],
      collapsed: false
    };
  },
  created() {
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
    onMenuSelect(item) {
      this.$router.push({ name: item.r_name });
      this.breadcrumb = [];
      this.breadcrumb.push("Home");
      this.breadcrumb.push(item.title);
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
.home-container {
  height: 100%;
  background: #f0f2f5;
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
