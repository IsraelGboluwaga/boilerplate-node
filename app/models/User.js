/**
 * Created by michael on 14/01/2018.
 * Objective: building to scale
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;
const config = require('../config/settings');

const collection = config.mongodb.collections;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone_number: {
    type: Number,
  }
}, {
  timestamps: true,
});


const UserModel = mongoose.model(collection.users, userSchema);

module.exports = UserModel;

