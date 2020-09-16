const jwt = require('jsonwebtoken');
const { TOKEN_ENCODE_STR, URL_YES_PASS } = require('../config/DBconfig');
const CheckCode = require('../models/checkcode.js');
const User = require('../models/user.js');

module.exports = {
  // 生成登录 token
  createToken(str, time) {
    return jwt.sign({ str }, TOKEN_ENCODE_STR, { expiresIn: time });
  },
  /*
    验证登录 token 是否正确  => 写成中间件
    get 请求与设置的请求不拦截验证，其余均需登录
  */
  async checkToken(ctx, next) {
    const { url } = ctx;
    if (ctx.method !== 'GET' && !URL_YES_PASS.includes(url)) {
      const token = ctx.get('Authorization');
      if (token === '') {
        // 直接抛出错误
        ctx.response.status = 401;
        ctx.response.body = '你还没有登录，快去登录吧!';
        return;
      }
      try {
        // 验证token是否过期
        const result = await jwt.verify(token, TOKEN_ENCODE_STR);
      } catch (e) {
        console.log(e);
        ctx.response.status = 401;
        ctx.response.body = '登录已过期请重新登录!';
        return;
      }
    }
    await next();
  },
  // 验证 验证码 token 与 code 是否正确
  async checkTokenCode(token, code) {
    try {
      // 验证码转大写
      code = code.toUpperCase();
      await jwt.verify(token, TOKEN_ENCODE_STR);
      // 读数据库，删除验证码
      const res = await CheckCode.findOneAndRemove({ token, code });
      if (res == null) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  },
};
