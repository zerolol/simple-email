const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const UserSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
}, { collection: 'user', versionKey: false });

module.exports = model('user', UserSchema);
