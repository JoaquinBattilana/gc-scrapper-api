const Query = require('../models/Query');

exports.getAllQueries = () => Query.find({}).exec();