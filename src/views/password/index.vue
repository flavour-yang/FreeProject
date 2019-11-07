<template>
  <div>
    <el-dialog title="密码修改" width="600px" :visible.sync="dialogVisible" @close="close">
      <el-form ref="loginForm" auto-complete="on" :rules="loginRules" :model="form">
        <el-form-item label="旧密码" prop="OldPassword" :label-width="formLabelWidth">
          <el-input
            v-model="form.OldPassword"
            placeholder="old Password"
            style="width: 350px"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="NewPassword" :label-width="formLabelWidth">
          <el-input
            :key="passwordType"
            ref="Password"
            v-model="form.NewPassword"
            style="width: 350px"
            :type="passwordType"
            placeholder="new Password"
            name="Password"
            tabindex="2"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
          <!-- <el-input v-model="form.NewPassword" autocomplete="off" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancal">取 消</el-button> -->
        <el-button type="primary" :loading="btnLoading" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 11 -->
  </div>
</template>

<script>
import { putPassword } from "@/api/user";
import MD5 from "js-md5";
export default {
  data() {
    return {
      dialogVisible: true,
      formLabelWidth: "120px",
      form: {},
      btnLoading: false,
      passwordType: "password",
      loginRules: {
        OldPassword: [
          { required: true, trigger: "blur", message: "请输入旧密码" }
        ],
        NewPassword: [
          { required: true, trigger: "blur", message: "请输入新密码" }
        ]
      }
    };
  },
  mounted() {
    this.form.LoginName = this.$store.state.user.name;
    console.log(this.$store.state.user.name);
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
    close() {
      this.dialogVisible = false;
      //   debugger
      this.$router.go(-1);
    },
    ok() {
      this.btnLoading = true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const { LoginName, OldPassword, NewPassword } = this.form;
          putPassword({
            LoginName: LoginName,
            OldPassword: MD5.base64(OldPassword),
            NewPassword: MD5.base64(NewPassword)
          })
            .then(res => {
              this.$message({
                message: "密码修改成功!",
                type: "success"
              });
              this.btnLoading = false;
              this.$router.go(-1);
            })
            .catch(err => {
              this.$message({
                message: "密码修改失败!",
                type: "error"
              });
              this.btnLoading = false;
              console.log(err);
            });
        } else {
          this.btnLoading = false;
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;
.show-pwd {
  position: absolute;
  left: 325px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
