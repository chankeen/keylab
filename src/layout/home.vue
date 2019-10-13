<template>
  <div class="home-container">
    <a-layout style="height:100%">
      <!-- 左側菜單欄 -->
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[memu[0].key]">
          <a-menu-item v-for="(item,i) in memu" :key="item.key" @click="onMenuSelect(item)">
            <a-icon :type="item.icon"></a-icon>
            <span>{{item.title}}</span>
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
import uuidv1 from "uuid/v1";
import { logout } from "@/api/user.js";
export default {
  data() {
    return {
      memu: [
        {
          r_name: "home_property",
          title: "Property / 物業",
          icon: "bank",
          key: uuidv1()
        },
        {
          r_name: "home_Propman",
          title: "Users -  Propman / 用戶 - 物管人員 ",
          icon: "team",
          key: uuidv1()
        },
        {
          r_name: "home_Oc",
          title: "Users - OC / 用戶 - 法團成員 ",
          icon: "team",
          key: uuidv1()
        },
        {
          r_name: "home_Contractor",
          title: "Users - Contractor / 用戶 - 承辦商",
          icon: "team",
          key: uuidv1()
        }
      ],
      breadcrumb: [],
      activeItem: [],
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
      sessionStorage.token = "";
      this.$message.success("登出成功");
      this.$router.push({ path: "/login" });
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
