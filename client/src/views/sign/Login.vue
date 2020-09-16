<template>
  <div class="sign-form">
    <el-form
      ref="loginForm"
      label-position="left"
      label-width="70px"
      :hide-required-asterisk="true"
      :model="loginForm"
      :rules="rules"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="loginForm.userName" placeholder="请输入用户昵称或手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入账号密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verificationCode">
        <div class="verification-code">
          <el-input v-model="loginForm.verificationCode" placeholder="请输入验证码"></el-input>
          <img :src="code.img" alt="验证码" title="请点击切换验证码" v-show="code.img" @click="getCode">
        </div>
      </el-form-item>
      <el-form-item label-width="0" class="sign-form-checkbox">
        <div class="checkbox-content">
          <!-- <el-checkbox v-model="checked">记住密码</el-checkbox> -->
          <p class="login-error-msg">
            <span v-show="isError && loginForm.password && loginForm.userName && loginForm.verificationCode">账号、密码或者验证码错误</span>
          </p>
        </div>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button
          type="primary"
          @click="handleLogin"
          class="sign-form-btn"
        >登录</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: '',
        verificationCode: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户昵称或手机号', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入账号密码', trigger: 'blur' }],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      code: {
        img: '',
        token: '',
      },
      // checked: false,
      isError: false,
    };
  },
  mounted() {
    this.getCode();
  },
  methods: {
    async getCode() {
      try {
        const { code, data, msg } = await this.$api.sign.getCode();
        if (code === 200) {
          this.code.img = data.img;
          this.code.token = data.token;
        } else {
          this.$message.error(msg || '获取验证码失败！');
        }
      } catch (e) {
        console.log(e);
      }
    },
    async handleLogin() {
      const { loginForm } = this.$refs;
      loginForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const {
          userName, password, verificationCode,
        } = this.loginForm;
        const params = {
          userName,
          password,
          code: verificationCode,
          token: this.code.token,
        };
        try {
          const { code, data, msg } = await this.$api.sign.login(params);
          if (code === 200) {
            this.$message.success(msg || '登录成功！');
            if (data) {
              data.phone = `${data.phone}@zy.com`;
            }
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            this.$router.push({ name: 'inbox' });
          } else {
            this.isError = true;
            this.loginForm.verificationCode = '';
            this.getCode();
            this.$message.error(msg || '登录失败！');
          }
        } catch (e) {
          console.log(e);
          this.loginForm.verificationCode = '';
          this.getCode();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-error-msg {
  font-size: 14px;
  color: red;
}
</style>
