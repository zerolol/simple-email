module.exports = {
  port: 9527, // 项目启动的端口
  db: 'mongodb://localhost:27017/email', // 数据库
  saltTimes: 3, // 加盐的次数（用户密码加密）
  PWD_ENCODE_STR: 'PWD_encode_str', // 用户密码加密字符串
  TOKEN_ENCODE_STR: 'token_encode_str', // token 加密字符串,
  URL_YES_PASS: ['/email/login', '/email/regist'], // 添加非get请求通过的连接
  AK: '****', // 七牛云申请自己的配置
  SK: '****',
  Bucket: 'emails',
};
