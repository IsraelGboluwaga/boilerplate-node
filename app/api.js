

const dotenv = require('dotenv');

dotenv.config();
const restify = require('restify');
const plugins = require('restify-plugins');

const config = require('../app/config/settings');
const userRoute = require('./routes/route');


// service locator via dependency injection
const serviceLocator = require('../app/config/di');

const logger = serviceLocator.get('logger');


const server = restify.createServer({
  name: config.appName,
  versions: ['1.0.0'],
});

// Connect to Mongo
serviceLocator.get('mongo');

// set API versioning and allow trailing slashes
server.pre(restify.pre.sanitizePath());


// set request handling and parsing
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());


// setup Routing and Error Event Handling
userRoute(server, serviceLocator);


server.listen(config.port, () => {
  logger.info(`${server.name} listening at ${server.url}`);
});
