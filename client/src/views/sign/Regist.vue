<template>
  <div class="sign-form">
    <el-form
      label-position="left"
      :hide-required-asterisk="true"
      label-width="70px"
      :model="registForm"
      :rules="rules"
      ref="registForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="registForm.userName" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="registForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registForm.password" placeholder="请输入账号密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="registForm.checkPassword" placeholder="请再次输入账号密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verificationCode">
        <div class="verification-code">
          <el-input v-model="registForm.verificationCode" placeholder="请输入验证码"></el-input>
          <img :src="code.img" alt="验证码" title="请点击切换验证码" v-show="code.img" @click="getCode">
        </div>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button
          type="primary"
          @click="handleRegist"
          class="sign-form-btn"
        >注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  name: 'Regist',
  data() {
    return {
      registForm: {
        userName: '',
        password: '',
        phone: '',
        checkPassword: '',
        verificationCode: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: this.validatePhoneNumber,
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入账号密码', trigger: 'blur' },
          {
            validator: this.validatePassword,
            trigger: 'blur',
          },
        ],
        checkPassword: [
          { required: true, message: '请输入账号密码', trigger: 'blur' },
          {
            validator: this.validateCheckPassword,
            trigger: 'blur',
          },
        ],
      },
      checked: false,
      code: {
        img: '',
        token: '',
      },
    };
  },
  mounted() {
    this.getCode();
  },
  methods: {
    async handleRegist() {
      const { registForm } = this.$refs;
      registForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const {
          userName, password, phone, verificationCode,
        } = this.registForm;
        const params = {
          userName,
          password,
          phone,
          code: verificationCode,
          token: this.code.token,
        };
        try {
          const { code, data, msg } = await this.$api.sign.regist(params);
          if (code === 200) {
            this.$emit('regist', valid);
            this.$message.success(msg || '注册成功！');
          } else {
            this.registForm.verificationCode = '';
            this.getCode();
            this.$message.error(msg || '注册失败');
          }
        } catch (e) {
          console.log(e);
          this.registForm.verificationCode = '';
          this.getCode();
        }
      });
    },
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
    validatePhoneNumber(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入手机号码'));
      }
      if (!/^1[0-9]{10}$/.test(value)) {
        return callback(new Error('手机号码格式不正确'));
      }
      callback();
    },
    validatePassword(rule, value, callback) {
      if (!/[A-Za-z0-9_]{6,20}$/.test(value)) {
        return callback(new Error('请输入正确的密码（数字、字符、或者数字字母组合6-20位）'));
      }
      if (this.registForm.checkPassword !== '') {
        this.$refs.registForm.validateField('checkPassword');
      }
      callback();
    },
    validateCheckPassword(rule, value, callback) {
      if (value !== this.registForm.password) {
        return callback(new Error('两次输入的密码不一致'));
      }
      callback();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
