<template>
  <div style="background:black">
    <div class="loginbox">
      <h2 class="uname">KeyMana</h2>
      <p class="input-item">
        <a-input v-model="login" name="user_name" placeholder="用户名" ref="userNameInput">
          <a-icon slot="prefix" type="user" />
        </a-input>
      </p>
      <p class="input-item">
        <a-input
          v-model="password"
          type="password"
          placeholder="密码"
          ref="userNameInput"
          v-on:keyup.enter="userLogin"
        >
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </p>
      <a-button
        size="large"
        style="width:100%"
        type="primary"
        @click="userLogin"
        :loading="loading"
      >Login</a-button>
    </div>
  </div>
</template>
<script>
import { login } from "@/api/user.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      login: "",
      password: "",
      form: this.$form.createForm(this),
      loading: false
    };
  },
  created() {},
  methods: {
    userLogin() {
      this.loading = true;
      login(this.login, this.password)
        .then(response => {
          if (response.rc == "1") {
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("admin_wp_id", response.admin_wp_id);
            this.$message.success("Welcome to KeyMana!");
            this.$router.push({ name: "home", params: {} });
          } else {
            this.$message.error("Invalid user name or password!");
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);

          this.loading = false;
          this.$message.error("Login error!");
        });
    }
  }
};
</script>

<style lang="scss">
.loginbox {
  text-align: center; /*让div内部文字居中*/
  background-color: #fff;
  border-radius: 20px;
  width: 75%;
  height: 45%;
  min-width: 300px;
  max-width: 300px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .uname {
    text-align: center;
    .anticon-github {
      svg {
        width: 4em !important;
        height: 4em !important;
      }
    }
  }
  .input-item {
    height: 40px !important;
    .ant-input-affix-wrapper {
      height: 40px !important;
    }
  }
}
</style>

