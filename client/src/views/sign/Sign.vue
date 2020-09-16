<template>
    <div id="sign">
      <section class="sign-content">
        <div class="sign-title">
          <h1>简易邮箱</h1>
          <p>基于vue + koa2的全栈入门项目</p>
        </div>
        <div class="sign-form-wrapper">
          <el-card>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <el-tab-pane label="登录" name="login">
                <login ref="loginModal" v-if="activeName === 'login'"></login>
              </el-tab-pane>
              <el-tab-pane label="注册" name="register">
                <regist ref="registModal" @regist="handleRegist" v-if="activeName === 'register'"></regist>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </section>
    </div>
</template>
<script>

import Login from './Login.vue';
import Regist from './Regist.vue';

export default {
  name: 'Sign',
  data() {
    return {
      activeName: 'login',
    };
  },
  components: {
    Login,
    Regist,
  },
  created() {
    sessionStorage.getItem('userInfo') && sessionStorage.getItem('userInfo') !== 'undefined' && this.$store.replaceState(Object.assign(this.$store.state.user, JSON.parse(sessionStorage.getItem('userInfo'))));

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', this.addInfo);
    window.addEventListener('keyup', this.handleKeyUp);

    this.$once('hook:beforeDestory', () => {
      window.removeEventListener('beforeunload', this.addInfo);
    });
    this.$once('hook:beforeDestory', () => {
      console.log(123);
      window.removeEventListener('keyup', this.handleKeyUp);
    });
  },

  methods: {
    // 切换登录或注册
    handleTabClick(value) {
      this.activeName = value.name;
    },
    // 注册成功后切换到登录
    handleRegist() {
      this.activeName = 'login';
    },
    // 监听回车事件
    handleKeyUp(event) {
      const { loginModal } = this.$refs;
      const { registModal } = this.$refs;
      if (event.key === 'Enter' || event.keyCode === 13) {
        if (this.activeName === 'login') {
          loginModal.handleLogin();
        } else {
          registModal.handleRegist();
        }
      }
    },
    addInfo() {
      sessionStorage.getItem('userInfo') && sessionStorage.getItem('userInfo') !== 'undefined' && sessionStorage.setItem('userInfo', JSON.stringify(this.$store.state.user));
    },
  },
  beforeDestory() {
    console.log('destory');
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
#sign {
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background: url(../../assets/email_bg.jpg) no-repeat;
  background-size: 100% 100%;
}
.sign-content {
  width: 100%;
}
.sign-title {
  text-align: center;
  color: #000000;
  margin-bottom: 36px;
  h1 {
    font-size: 36px;
    line-height: 54px;
    font-weight: normal;
  }
  p {
    font-size: 16px;
  }
}
.sign-form-wrapper {
  width: 440px;
  margin: 0 auto;
  /deep/ .el-card__body {
    padding: 20px 40px;
  }
  /deep/ .el-tabs__item {
    font-size: 20px;
    color: $-color--secondary;
    &.is-active {
      color: $-color--main;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: $-primary-border--color;
  }
}
.sign-form {
  padding-top: 10px;
  /deep/ .el-form-item {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 16px;
    }
  }
  /deep/ .el-input__inner {
    color: $-color--main;
  }
  /deep/ &-checkbox {
    margin-bottom: 10px;
    .el-form-item__content {
      line-height: 20px;
    }
  }
  /deep/ .checkbox-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 20px;
    .el-form-item__content {
      line-height: 20px;
    }
  }
  /deep/ &-btn {
    width: 100%;
    font-size: 16px;
  }
  /deep/ .verification-code {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .el-input__inner {
      width: 148px;
    }
    img {
      width: 120px;
      cursor: pointer;
    }
  }
}
</style>
