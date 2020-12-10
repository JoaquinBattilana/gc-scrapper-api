const axios = require('axios');

const gcApi = axios.create({
  baseURL: 'https://compragamer.com',
  timeout: 5000
});

module.exports = gcApi;
