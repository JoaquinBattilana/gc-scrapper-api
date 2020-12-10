require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const User = require('./models/User');
const { getAllQueries } = require('./services/QueryService');
const { getAllUsers, getUserByChatId } = require('./services/UserService')
const { getGcSearchPage } = require('./services/GcSearchService');
const { getGcItemsFromSearchPage, itemsToString } = require('./utils/scrapping');

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.log('connection error', err));
db.once('open', () => console.log('Connection to DB successful'));

const getGcItems = async () => {
  const queries = await getAllQueries();
  const pages = await Promise.all(queries.map(q => getGcSearchPage(q.query)));
  const items = pages.reduce((acum, item) => [...acum, ...getGcItemsFromSearchPage(item.data)], []);
  return items;
}

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const job = new CronJob('0 */5 * * * *', () => {
  console.log('Executing cron!');
  getAllUsers().then(users => {
    getGcItems().then(items => {
      const stockItems = items.filter(item => item.stock);
      if(stockItems.length) {
        users.forEach(user => bot.sendMessage(user.chatId, itemsToString(stockItems)))
      }
    })
  })
});

job.start();


bot.onText(/\/subscribe/, msg => {
  const chatId = msg.chat.id;
  getUserByChatId(chatId).then( user => {
    if(user) bot.sendMessage(chatId, 'Already subscribed');
    else {
      const newUser = new User({ chatId });
      newUser.save(err => err ? console.log(err) : console.log('User added'));
      bot.sendMessage(chatId, 'Subscribed!');
    }
  })
});

bot.onText(/\/stock/, msg => {
  const chatId = msg.chat.id;
  getGcItems()
  .then(items => bot.sendMessage(chatId, itemsToString(items)));
});
const app = express();

app.use(bodyParser.json());

module.exports = app;