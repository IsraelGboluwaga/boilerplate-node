/**
 * Created by michael on 11/01/2018.
 * objective: building to scale
 */

const redis = require('redis');
const rabbit = require('amqplib');
const bluebird = require('bluebird');
const mongoose = require('mongoose');

const config = require('../config/settings');
const serviceLocator = require('../lib/serviceLocator');

const winston = require('winston');
require('winston-daily-rotate-file');

const UserService = require('../services/userService');
const UserController = require('../controllers/UserController');
const TransactionService = require('../services/TransactionService');
const TransactionController = require('../controllers/TransactionController');


/**
 * Returns an instance of logger for the API
 */
serviceLocator.register('logger', () => {
  const fileTransport = new (winston.transports.DailyRotateFile)({
    filename: `${config.logging.file}`,
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });

  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });
  const transports = [consoleTransport];

  if (config.logging.shouldLogToFile.toString() === 'true') {
    transports.push(fileTransport);
  }
  const winstonLogger = new (winston.Logger)({
    transports,
  });
  return winstonLogger;
});


/**
 * Returns a Mongo connection instance.
 */
serviceLocator.register('mongo', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString = (!config.mongodb.username || !config.mongodb.password) ? `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}` : `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
  mongoose.Promise = bluebird;
  const mongo = mongoose.connect(connectionString);
  mongo.connection.on('connected', () => {
    logger.info('Mongo Connection Established');
  });
  mongo.connection.on('error', (err) => {
    logger.error(`Mongo Connection Error : ${err}`);
    process.exit(1);
  });
  mongo.connection.on('disconnected', () => {
    logger.error('Mongo Connection disconnected');
    process.exit(1);
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongo.connection.close(() => {
      logger.error('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

  return mongo;
});


/**
 * Returns a RabbitMQ connection instance.
 */
serviceLocator.register('rabbitmq', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString = `amqp://${config.rabbitMQ.user}:${config.rabbitMQ.pass}@${config.rabbitMQ.host}:${config.rabbitMQ.port}`;

  return rabbit.connect(connectionString, (err, connection) => new Promise((resolve, reject) => {
    // If the connection throws an error
    if (err) {
      logger.error(`RabbitMQ connection error: ${err}`);
      return reject(err);
    }

    connection.on('error', (connectionError) => {
      logger.error(`RabbitMQ connection error: ${connectionError}`);
      process.exit(1);
    });

    connection.on('blocked', (reason) => {
      logger.error(`RabbitMQ connection blocked: ${reason}`);
      process.exit(1);
    });

    // If the Node process ends, close the RabbitMQ connection
    process.on('SIGINT', () => {
      connection.close();
      process.exit(0);
    });


    return resolve(connection);
  }));
});


/**
 * Returns a Redis connection instance.
 */
serviceLocator.register('redis', (servicelocator) => {
  const logger = servicelocator.get('logger');
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  const connectionParameters = {
    host: config.redis.host,
    port: config.redis.port,
    db: config.redis.database,
  };
  if (config.redis.password) {
    connectionParameters.password = config.redis.password;
  }
  const myRedis = redis.createClient(connectionParameters);
  myRedis.on('connect', () => {
    logger.info('Redis connection established');
  });
  myRedis.on('error', (err) => {
    logger.error(`Connection error : ${err}`);
    myRedis.quit();
    process.exit(1);
  });

  myRedis.on('end', () => {
    logger.error('Redis is shutting down');
    process.exit(1);
  });

  // If the Node process ends, close the Redis connection
  process.on('SIGINT', () => {
    myRedis.quit();
    process.exit(0);
  });


  return myRedis;
});

/**
 * Creates an instance of the User Service
 */
serviceLocator.register('userService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mongo = servicelocator.get('mongo');
  return new UserService(logger, mongo);
});


/**
 * Creates an instance of the User Controller
 */
serviceLocator.register('userController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const service = servicelocator.get('userService');
  return new UserController(logger, service);
});

/**
 * Creates an instance of the Transaction Service
 */
serviceLocator.register('transactionService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mongo = servicelocator.get('mongo');
  return new TransactionService(logger, mongo);
});


/**
 * Creates an instance of the Transaction Controller
 */
serviceLocator.register('TransactionController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const service = servicelocator.get('applicantService');
  return new TransactionController(logger, service);
});


module.exports = serviceLocator;
