/**
 * Created by michael on 15/01/2018.
 * objective: building to scale
 */

/* eslint-disable no-unused-vars */

const dotenv = require('dotenv');

dotenv.config();

const config = require('../config/settings');

// service locator via dependency injection
const serviceLocator = require('../config/di');

serviceLocator.get('mongo');
const logger = serviceLocator.get('logger');
const rabbitMQClient = serviceLocator.get('rabbitmq');

const cookieController = serviceLocator.get('cookieController');

const queue = config.rabbitMQ.queues.transactions;
rabbitMQClient.then(connection => connection.createChannel())
  .then((channel) => {
    channel.prefetch(1);
    channel.assertQueue(queue, { durable: true, noAck: false })
      .then(ok => channel.consume(queue, (messageObject) => {
        if (messageObject !== null) {
          // handle message
        }
        return null;
      }));
  });

