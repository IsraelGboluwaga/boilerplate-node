/* eslint-disable no-underscore-dangle */

const usersModel = require('../models/User');
const transactionModel = require('../models/Transaction');
const MongoDBHelper = require('../lib/mongoDBHelper');
const utilityHelper = require('../lib/utilityHelper');
const config = require('../config/settings');

class TransactionService {
  constructor(logger, mongo) {
    this.logger = logger;
    this.usersMongoDBHelper = new MongoDBHelper(mongo, usersModel);
    this.TransactionMongoDBHelper = new MongoDBHelper(mongo, transactionModel);
  }
}

module.exports = TransactionService;

