

const config = require('../config/settings');

const routes = function routes(server, serviceLocator) {
  const userController = serviceLocator.get('userController');
  server.get({
    path: '/',
    name: 'base',
    version: '1.0.0',
  }, (req, res) => res.send(`Welcome to ${config.appName} API`));


  server.post({
    path: '/users',
    name: 'Create new User Account',
    version: '1.0.0',
  }, (req, res) => userController.createUser(req, res));


  server.post({
    path: '/user/login',
    name: 'login users',
    version: '1.0.0',
  }, (req, res) => userController.loginUser(req, res));

  server.post({
    path: '/users/:id',
    name: 'Update User Account',
    version: '1.0.0',
  }, (req, res) => userController.updateUser(req, res));
  server.get({
    path: '/users/:userId',
    name: 'Get User Details',
    version: '1.0.0',
  }, (req, res) => userController.getUser(req, res));
  server.get({
    path: '/users/verify/:user_id',
    name: 'verify email Address',
    version: '1.0.0',
  }, (req, res) => userController.verifyEmail(req, res));
  server.get({
    path: '/users/forgot_password/:email',
    name: 'forget password',
    version: '1.0.0',
  }, (req, res) => userController.forgetPassword(req, res));
};


module.exports = routes;

