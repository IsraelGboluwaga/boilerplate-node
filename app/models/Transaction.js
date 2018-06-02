/**
 * Created by michael on 14/01/2018.
 * Objective: building to scale
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;
const config = require('../config/settings');

const collection = config.mongodb.collections;

const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
  },
  receiver_email: {
    type: String,
    required: true
  },
  receiver_id: {
    type: String,
    required: true
  },
  sender_id: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  },
  picture_url: {
    type: String,
  }
}, {
  timestamps: true,
});


const TransactionModel = mongoose.model(collection.transactions, transactionSchema);

module.exports = TransactionModel;
