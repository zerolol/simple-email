/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
const qiniu = require('qiniu');
const config = require('../config/DBconfig.js');
const EmailInboxModel = require('../models/emailInbox');

module.exports = {
  // 发送邮件
  async sendEmail(ctx, next) {
    const {
      mailSender, mailPhone, receiver, receiverCc, subject, content, attachList,
    } = ctx.request.body;
    const params1 = {
      mailSubject: subject,
      mailContent: content,
      mailStatus: 0,
      sendDate: +new Date(),
      mailSender,
      mailPhone,
      mailReceiver: receiver,
      mailReceiverCC: receiverCc,
      attachList,
      mailType: '0',
    };
    const params2 = {
      mailSubject: subject,
      mailContent: content,
      mailStatus: 0,
      sendDate: +new Date(),
      mailSender,
      mailPhone,
      mailReceiver: receiver,
      mailReceiverCC: receiverCc,
      attachList,
      mailType: '1',
    };
    try {
      await new EmailInboxModel({ ...params1 }).save();
      await new EmailInboxModel({ ...params2 }).save();
      ctx.body = {
        code: 200,
        msg: '发送成功！',
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: e.message || '发送失败！',
      };
    }
  },
  // 收件箱
  async getInbox(ctx, next) {
    const {
      mailPhone, page = 1, pageSize = 10, mailType,
    } = ctx.request.body;
    const reg = new RegExp(mailPhone, 'g');
    let total; let
      result;

    try {
      if (mailType === '0') {
        total = await EmailInboxModel.countDocuments({ $or: [{ mailReceiver: reg }, { mailReceiverCC: reg }], mailType }); // 表总记录数
        result = await EmailInboxModel.find({ $or: [{ mailReceiver: reg }, { mailReceiverCC: reg }], mailType }).limit(pageSize * 1).skip((page - 1) * pageSize).sort({ sendDate: -1 });
      } else if (mailType === '1') {
        total = await EmailInboxModel.countDocuments({ mailPhone, mailType }); // 表总记录数
        result = await EmailInboxModel.find({ mailPhone, mailType }).limit(pageSize * 1).skip((page - 1) * pageSize).sort({ sendDate: -1 });
      } else {
        total = await EmailInboxModel.countDocuments({ $or: [{ mailPhone: reg }, { mailReceiver: reg }, { mailReceiverCC: reg }], mailType }); // 表总记录数
        result = await EmailInboxModel.find({ $or: [{ mailPhone: reg }, { mailReceiver: reg }, { mailReceiverCC: reg }], mailType }).limit(pageSize * 1).skip((page - 1) * pageSize).sort({ sendDate: -1 });
      }

      ctx.body = {
        code: 200,
        data: result || [],
        total,
        msg: '查询成功！',
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '查询失败，服务器异常！',
      };
    }
  },
  // 删除邮件
  async deleteLetter(ctx, next) {
    const { emailIds, mailType } = ctx.request.body;
    try {
      const arr = emailIds.split(',');
      if (mailType === '2') {
        await EmailInboxModel.deleteMany({ mailType, _id: arr });
      } else {
        await EmailInboxModel.updateMany({ mailType, _id: arr }, { $set: { mailType: 2 } });
      }

      ctx.body = {
        code: 200,
        msg: '删除成功！',
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: e.message || '删除失败，服务器异常！',
      };
    }
  },
  // 获得邮件详情
  async getEmailDetail(ctx, next) {
    const { emailId, mailStatus } = ctx.request.body;
    try {
      if (mailStatus === '0') {
        await EmailInboxModel.updateOne({ _id: emailId }, { $set: { mailStatus: 1 } });
      }
      const result = await EmailInboxModel.findOne({ _id: emailId });
      ctx.body = {
        code: 200,
        data: result || [],
        msg: '查询成功！',
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '查询失败，服务器异常！',
      };
    }
  },
  // 获得七牛云token
  async getQiniuToken(ctx, next) {
    try {
      const mac = new qiniu.auth.digest.Mac(config.AK, config.SK);
      let code = 500; const msg = ''; const
        data = {};
      const options = {
        scope: config.Bucket,
        expires: 3600 * 24,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      if (uploadToken) {
        code = 200;
        data.uploadToken = uploadToken;
        ctx.body = { code, data, msg };
      } else {
        ctx.body = { code, data, msg };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '查询失败，服务器异常！',
      };
    }
  },
};
