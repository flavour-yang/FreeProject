<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <span
      style="color: #409EFF; cursor: pointer;margin: 17px 0 0 20px;display: inline-block;"
      @click="home"
    >首页</span>
    <el-tag
      v-for="(item, index) in asinList"
      :key="index"
      closable
      :effect="asin === item ? 'dark':'plain'"
      :disable-transitions="false"
      style="cursor: pointer;margin: 10px 5px 0;"
      @click="handleClick(item)"
      @close="handleClose(item)"
    >{{ item }}</el-tag>
    <!-- :effect="asin === item ? 'dark':'plain'" -->
    <div class="right-menu">
      <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" width="32" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item>

          </el-dropdown-item>
          <el-dropdown-item>

          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
      <div class="user" @click="editPassword">
        <img :src="avatar" class="user-avatar">
        <span style="margin-left: 5px;">{{ name }}</span>
      </div>
      <!-- <span style="display:block;" @click="editPassword">修改密码</span> -->
      <div class="login-out" @click="logout">
        <img :src="require('@/assets/user/out.png')" width="18">
        <span style="display:block;font-size: 14px;margin-left: 5px;">退出</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    // Hamburger
  },
  inject: ["reload"],
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "asinList", "asin"])
  },
  methods: {
    home() {
      this.$router.push("/table");
    },
    handleClose(value) {
      this.$store.commit("table/REMOVE_ASIN", value);
      const list = this.$store.state.table.asinList;
      if (this.asin === value) {
        // 相同则去除同时刷新当前页面
        if (list.length) {
          const asin = list[list.length - 1];
          this.$store.commit("table/SET_ASIN", asin);
          this.$router.push({
            path: "/echarts/echarts",
            query: { asin: asin }
          });
          this.reload();
        } else { // 清除后跳回table
          this.$router.push("/table");
        }
      }
    },
    handleClick(value) {
      this.$store.commit("table/SET_ASIN", value);
      this.$router.push({
        path: "/echarts/echarts",
        query: { asin: value }
      });
      this.reload();
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push(`/login`); // ?redirect=${this.$route.fullPath}
    },
    editPassword() {
      // debugger
      this.$router.push(`/password/index`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    color: #5a5e66;
    margin-right: 30px;
    // line-height: 50px;
    .user {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      transition: all 0.3s;
      .user-avatar {
        width: 18px;
        height: 18px;
        border-radius: 10px;
      }
      &:hover {
        color: #409eff;
        transition: all 0.3s;
      }
    }
    .login-out {
      margin-left: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: #409eff;
        transition: all 0.3s;
      }
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 12px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 22px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
