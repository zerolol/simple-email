const config = require('../config/DBconfig');
const passport = require('../utils/passport.js');
const UserModel = require('../models/user.js');
const { createToken, checkTokenCode } = require('../utils/token');

const get = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    msg: 'get request!!',
    data: {
      data: ctx.request.query,
    },
  };
};

// 登录
const login = async (ctx, next) => {
  const {
    userName, phone, password, token, code,
  } = ctx.request.body;
  try {
    // 判断验证码
    const mark = await checkTokenCode(token, code);
    if (!mark) {
      ctx.body = {
        code: 401,
        msg: '注册失败，验证码错误！',
      };
      return;
    }
    // 判断用户名是否存在
    let user = await UserModel.findOne({
      userName,
    });
    if (!user) {
      user = await UserModel.findOne({
        phone: userName,
      });
    }
    if (!user) {
      ctx.body = {
        code: 401,
        msg: '请输入正确的用户名！',
      };
      return;
    }
    // 验证密码
    const match = await passport.validate(password, user.hash);
    if (match) {
      const newToken = createToken(phone, '12h');
      ctx.body = {
        code: 200,
        msg: '登录成功！',
        data: {
          userName: user.userName,
          phone: user.phone,
          token: newToken,
        },
      }
      return;
    }
    ctx.body = {
      code: 401,
      msg: '请输入正确的用户名和密码！',
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: '注册失败，服务器异常！',
    };
  }
};

// 注册
const regist = async (ctx, next) => {
  const {
    userName, password, phone, code, token,
  } = ctx.request.body;
  try {
    // 判断验证码
    const mark = await checkTokenCode(token, code);
    if (!mark) {
      ctx.body = {
        code: 401,
        msg: '注册失败，验证码错误！',
      };
      return;
    }

    // 判断用户名是否重复
    let res = await UserModel.findOne({ userName });
    if (res) {
      ctx.body = {
        code: 409,
        msg: '注册失败，用户名重复！',
      };
      return;
    }
    // 判断手机号是否重复
    res = await UserModel.findOne({ phone });
    if (res) {
      ctx.body = {
        code: 409,
        msg: '注册失败，手机号码重复！',
      };
      return;
    }
    const hash = await passport.encrypt(password, config.saltTimes);
    res = await UserModel.create({
      phone, userName, token: '', hash,
    });
    if (res.phone) {
      ctx.body = {
        code: 200,
        msg: '注册成功！',
        data: {},
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败，服务器异常！',
      };
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: '注册失败，服务器异常！',
    };
  }
};

//修改密码
const modifyPassword = async (ctx, next) => {
  const {
    phone, oldPassword, newPassword,
  } = ctx.request.body;
  console.log(oldPassword);
  try {
    // 判断phone是否存在
    let user = await UserModel.findOne({
      phone,
    });
    if (!user) {
      ctx.body = {
        code: 500,
        msg: '修改失败，请输入正确的手机号！',
      };
      return;
    }
    const match = await passport.validate(oldPassword, user.hash);
    if (match) {
      const hash = await passport.encrypt(newPassword, config.saltTimes);
      const result = await UserModel.updateOne({ phone }, { $set: { hash } });
      if (result && result.ok === 1) {
        ctx.body = {
          code: 200,
          msg: '修改密码成功！',
          data: {
            userName: user.userName,
            phone: user.phone,
            token: user.token,
          },
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '修改失败！',
        };
      }
      return;
    }
    ctx.body = {
      code: 500,
      msg: '修改失败，请输入正确的密码！',
    };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  get,
  login,
  regist,
  modifyPassword
};
