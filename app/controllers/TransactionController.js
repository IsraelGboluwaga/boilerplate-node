/* eslint-disable eqeqeq */

const Response = require('../lib/responseManager');
const HttpStatus = require('../constants/httpStatus');
const config = require('../config/settings');


class TransactionController {
  constructor(logger, service) {
    this.logger = logger;
    this.transactionService = service;
  }
}

module.exports = TransactionController;
