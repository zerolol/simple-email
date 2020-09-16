const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const CheckCodeSchema = new Schema({
  token: {
    type: String,
    default: '',
  },
  code: String,
}, { collection: 'checkCode', versionKey: false });

module.exports = model('checkCode', CheckCodeSchema);
