const User = require('../models/User');

exports.getAllUsers = () => User.find({}).exec();

exports.getUserByChatId = chatId => User.findOne({chatId}).exec();