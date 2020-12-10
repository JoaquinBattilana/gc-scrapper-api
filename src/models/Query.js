const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new Schema({
  query: String
});

const Query = mongoose.model('Query', querySchema, 'queries');

module.exports = Query;
