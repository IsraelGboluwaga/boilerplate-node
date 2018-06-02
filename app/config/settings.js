/**
 * Created by michael on 11/01/2018.
 * objective: building to scale
 */


const config = {
  appName: process.env.APP_NAME,
  port: process.env.API_PORT,
  logging: {
    file: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL || 'warn',
    console: process.env.LOG_ENABLE_CONSOLE || true,
    shouldLogToFile: process.env.COOKIE_SYNC_ENABLE_FILE_LOGGING || false,
  },
  mongodb: {
    host: process.env.JUST_PAY_MONGO_HOST,
    username: process.env.JUST_PAY_MONGO_USER,
    password: process.env.JUST_PAY_MONGO_PASSWORD,
    port: process.env.JUST_PAY_MONGO_PORT,
    db: process.env.JUST_PAY_MONGO_DB_NAME,
    query_limit: process.env.JUST_PAY_MONGO_QUERY_LIMIT,
    collections: {
      transactions: 'Transactions',
      withdrawals: 'Withdrawals',
      deposits: 'Deposits',
      users: 'Users'
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    database: process.env.REDIS_DATABASE,
    password: process.env.REDIS_PASSWORD,
    pubSubchannels: {
      talentBase: 'CookieChannel'
    }
  },
  rabbitMQ: {
    host: process.env.JUST_PAY_MONGO_RABBIT_HOST,
    port: process.env.JUST_PAY_MONGO_RABBIT_PORT,
    user: process.env.JUST_PAY_MONGO_RABBIT_USER,
    pass: process.env.JUST_PAY_MONGO_RABBIT_PASS,
    queues: {
      transactions: 'JUSTPAYTransactionQueue',
      withdrawals: 'JUSTPAYWithdrawalQueue'
    },
  },
  TokenSigning: {
    secret: process.env.TOKEN_SECRET,
    algorithm: process.env.TOKEN_SIGNING_ALGORITHM,
  },
  TransactionStatus: {
    PENDING: 0,
    SUCCESSFUL: 1,
    UNSUCCESSFUL: 2,
    CANCELED: 3
  },
  MongoErrorCode: {
    duplicateError: 11000
  }
};

module.exports = config;
