<!--
 * @Author: your name
 * @Date: 2019-10-29 14:04:54
 * @LastEditTime: 2019-12-10 17:27:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template\src\views\login\index.vue
 -->
<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="LoginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="LoginName"
          v-model="loginForm.LoginName"
          placeholder="Username"
          name="LoginName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="Password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="Password"
          v-model="loginForm.Password"
          :type="passwordType"
          placeholder="Password"
          name="Password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-checkbox v-model="checked" style="margin-bottom: 12px;">记住密码</el-checkbox>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Login</el-button>
    </el-form>
    <div class="login-background" />
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import Cookies from "js-cookie";
// var MD5 = require('blueimp-md5/js/md5')
import MD5 from "js-md5";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error("The password can not be less than 1 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        LoginName: "",
        Password: ""
      },
      checked: false,
      loginRules: {
        LoginName: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        Password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    },
    checked(val) {
      localStorage.setItem("checked", val);
    }
  },
  mounted() {
    //
    if (localStorage.getItem("checked") === "true") {
      this.checked = true;
    }

    this.loginForm.LoginName = Cookies.get("LoginName");
    this.loginForm.Password = Cookies.get("Password");
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.Password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const loginInfo = {
          LoginName: this.loginForm.LoginName,
          Password: ""
        };
        if (
          Cookies.get("Password") &&
          Cookies.get("Password") === this.loginForm.Password
        ) {
          loginInfo.Password = Cookies.get("Password");
        } else {
          loginInfo.Password = MD5.base64(this.loginForm.Password);
        }

        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", loginInfo)
            .then(() => {
              this.$store.dispatch("user/addRouter").then(res => {
                if (this.checked) {
                  Cookies.set("LoginName", this.loginForm.LoginName);
                  if (!Cookies.get("Password")) {
                    Cookies.set(
                      "Password",
                      MD5.base64(this.loginForm.Password)
                    );
                  }
                } else {
                  Cookies.remove("LoginName");
                  Cookies.remove("Password");
                }
                // this.$router.options.routes.push(res[0])
                this.$router.addRoutes(res);
                // debugger
                this.$router.push({ path: this.redirect || "/" });
                this.loading = false;
                // next({ ...to})
              });
              // debugger
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  position: relative;
  z-index: 1;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 120px auto 0;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .login-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: url("../../assets/login/login.jpg") no-repeat center / cover;
    transform: scale(1.01);
    filter: blur(5px);
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
