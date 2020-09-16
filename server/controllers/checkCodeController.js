/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
const { BMP24 } = require('gd-bmp');
const { createToken } = require('../utils/token');
const CheckCodeModel = require('../models/checkcode');

function rand(min, max) {
  return Math.random() * (max - min + 1) + min | 0; // 特殊的技巧，|0可以强制转换为整数
}

function makeCapcha() {
  const img = new BMP24(100, 40);
  img.drawCircle(rand(0, 100), rand(0, 40), rand(10, 40), rand(0, 0xffffff));
  // 边框
  img.drawRect(0, 0, img.w - 1, img.h - 1, rand(0, 0xffffff));
  img.fillRect(0, 0, 100, 40, 0x252632);
  // img.fillRect(rand(0, 100), rand(0, 40), rand(10, 35), rand(10, 35), rand(0, 0xffffff));
  img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
  // return img;
  // 画曲线
  const w = img.w / 2;
  const { h } = img;
  const color = rand(0, 0xffffff);
  const y1 = rand(-5, 5); // Y轴位置调整
  const w2 = rand(10, 15); // 数值越小频率越高
  const h3 = rand(4, 6); // 数值越小幅度越大
  const bl = rand(1, 5);
  for (let i = -w; i < w; i += 0.1) {
    const y = Math.floor(h / h3 * Math.sin(i / w2) + h / 2 + y1);
    const x = Math.floor(i + w);
    for (let j = 0; j < bl; j += 1) {
      img.drawPoint(x, y + j, color);
    }
  }

  const p = 'ABCDEFGHKMNPQRSTUVWXYZ3456789';
  let str = '';
  for (let i = 0; i < 4; i += 1) {
    str += p.charAt(Math.random() * p.length | 0);
  }

  const fonts = [BMP24.font12x24, BMP24.font16x32];
  // var fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
  let x = 15;
  let y = 8;
  for (let i = 0; i < str.length; i += 1) {
    const f = fonts[Math.random() * fonts.length | 0];
    y = 8 + rand(-5, 5);
    img.drawChar(str[i], x, y, f, rand(0xaaaaaa, 0xffffff));
    x += f.w + rand(2, 8);
  }
  return { code: str, img };
}

module.exports = {
  // 验证码获取
  async getCode(ctx, next) {
    try {
      const { code, img } = makeCapcha();
      const token = createToken(code, 60);
      await new CheckCodeModel({ token, code }).save();

      ctx.body = {
        code: 200,
        msg: '获取验证码成功！',
        data: {
          token,
          img: `data:image/bmp;base64,${img.getFileData().toString('base64')}`,
        },
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '获取验证码失败！',
      };
    }
  },
};
