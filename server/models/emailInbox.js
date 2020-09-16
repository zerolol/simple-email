const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const EmailInboxSchema = new Schema({
  mailSubject: { // 邮件主题
    type: String,
    required: true,
  },
  mailContent: { // 邮件正文
    type: String,
    required: true,
  },
  mailStatus: { // 0未读邮件 1已读邮件
    type: Number,
    required: true,
  },
  sendDate: { // 发送邮件时间
    type: String,
    required: true,
  },
  mailSender: { // 发件人
    type: String,
    required: true,
  },
  mailPhone: { // 发件人电话
    type: String,
    required: true,
  },
  mailReceiver: { // 收件人
    type: String,
    required: true,
  },
  mailReceiverCC: { // 抄送人
    type: String,
  },
  attachList: {
    type: Array,
  },
  mailType: { // 邮件类型 1 发件箱 0 收件箱 2 已删除
    type: String,
    required: true,
  },
}, { collection: 'emailInbox', versionKey: false });

module.exports = model('emailInbox', EmailInboxSchema);
