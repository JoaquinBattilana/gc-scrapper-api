const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  chatId: Number
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
