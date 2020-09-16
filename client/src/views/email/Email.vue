<template>
  <div id="email">
    <el-container>
        <el-header height="70px">
            <div class="header-left">
              <div class="header-img">
                  <span>MAIL</span>
              </div>
              <div class="header-title">
                  <span>简易邮箱</span>
                  <span>zy.com</span>
              </div>
            </div>
            <div class="header-right">
                <span>{{`${userInfo.userName}（${userInfo.phone}）`}}</span>
                <el-dropdown trigger="click" @command="handleCommand">
                  <div class="portrait-wrapper">
                    <img src="../../assets/portrait.jpg" alt="#">
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="password">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <span class="logout" @click="logout">登出</span> -->
            </div>
        </el-header>
        <el-container class="contailer-content">
            <el-aside width="214px">
                <menu-left></menu-left>
            </el-aside>
            <el-main>
                <router-view :userInfo="userInfo"></router-view>
            </el-main>
        </el-container>
    </el-container>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="350px">
      <el-form
        label-position="left"
        :hide-required-asterisk="true"
        label-width="70px"
        :model="modifyForm"
        :rules="rules"
        ref="modifyForm"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="modifyForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="modifyForm.oldPassword" placeholder="请输入旧密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="modifyForm.newPassword" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MenuLeft from './MenuLeft.vue';

export default {
  name: 'Email',
  components: {
    MenuLeft,
  },
  data() {
    return {
      userInfo: {
        userName: '',
        phone: '',
      },
      dialogVisible: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: this.validatePhoneNumber,
            trigger: 'blur',
          },
        ],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            validator: this.validatePassword,
            trigger: 'blur',
          },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            validator: this.validatePassword,
            trigger: 'blur',
          },
        ],
      },
      modifyForm: {
        phone: '',
        newPassword: '',
        oldPassword: '',
      },
    };
  },
  methods: {
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
        return callback(new Error('数字、字符、或者数字字母组合6-20位'));
      }
      callback();
    },
    handleCommand(command) {
      if (command === 'logout') {
        sessionStorage.removeItem('userInfo');
        this.$router.push({ name: 'sign' });
      } else {
        this.modifyForm.phone = this.userInfo && this.userInfo.phone && this.userInfo.phone.slice(0, 11);
        this.dialogVisible = true;
      }
    },
    addInfo() {
      sessionStorage.getItem('userInfo') && sessionStorage.setItem('userInfo', JSON.stringify(this.$store.state.user));
    },
    async handOK() {
      const { modifyForm } = this.$refs;
      modifyForm.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const {
          phone, oldPassword, newPassword,
        } = this.modifyForm;
        if (this.userInfo.phone.slice(0, 11) !== phone) {
          this.$message.error('请输入自己的手机号！');
          return;
        }
        const params = {
          newPassword,
          oldPassword,
          phone,
        };
        try {
          const { code, data, msg } = await this.$api.sign.modifyPassword(params);
          if (code === 200) {
            this.dialogVisible = false;
            this.$store.commit('setUser', data);
            this.addInfo();
            this.$message.success(msg || '修改成功！');
          } else {
            this.$message.error(msg || '修改失败！');
          }
        } catch (e) {
          console.log(e);
        }
      });
    },
  },
  created() {
    let userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      this.userInfo.userName = userInfo.userName;
      this.userInfo.phone = userInfo.phone;
      this.$store.replaceState({ ...this.$store.state, user: userInfo });
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', this.addInfo);
    this.$once('hook:beforeDestory', () => {
      window.removeEventListener('beforeunload', this.addInfo);
    });
  },
};
</script>
<style lang="scss" scoped>
#email {
    width: 100%;
    background: #ffffff;
}
.el-header {
    display: flex;
    width: 100%;
    padding: 0;
}
.header-left {
    position: relative;
    width: 214px;
    flex: 0 0 214px;
    padding: 20px 16px 0 39px;
    background: #2577E3;
    display: flex;
    color: #ffffff;
    .header-img {
        font-family: SourceHanSansCN-Heavy;
        font-weight: 600;
        font-size: 34px;
        letter-spacing: -4;
    }
    .header-title {
        margin-left: 5px;
        span {
            font-size: 14px;
        }
    }
    &:after {
        position: absolute;
        content: '';
        left: 16px;
        bottom: 0;
        width: 182px;
        height: 1px;
        background: linear-gradient(to right, #2577E3, #FFFFFF, #2577E3);
    }
}
.header-right {
    padding: 0 40px;
    flex: 1;
    background: #FFFFFF;
    font-size: 14px;
    color: #313131;
    display: flex;
    justify-content: space-between;
    line-height: 70px;
    .portrait-wrapper {
      position: relative;
      display: inline-block;
      margin-top: 6px;
      width: 58px;
      height: 58px;
      background: #dbdbdb;
      border-radius: 50%;
      cursor: pointer;
      img {
        width: 50px;
        height: 50px;
        margin: 4px 0 0 4px;
        border-radius: 50%;
      }
      i {
        position: absolute;
        right: -16px;
        top: 25px;
        color: #999999;
      }
    }
}
.contailer-content {
    min-height: calc(100vh - 70px);
}
.el-aside {
    padding: 64px 0 20px;
    background: #2577E3;
}
.el-main {
    padding: 20px;
    background: #f5f6fa;
}
</style>
