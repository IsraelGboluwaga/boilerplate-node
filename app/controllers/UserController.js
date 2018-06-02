/* eslint-disable eqeqeq,camelcase */

const Response = require('../lib/responseManager');
const HttpStatus = require('../constants/httpStatus');
const config = require('../config/settings');


class UserController {
  constructor(logger, service) {
    this.logger = logger;
    this.userService = service;
  }


  createUser(req, res) {
    const { body } = req;
    const requestError = [];
    if (!body.email) requestError.push('please provide email address');
    if (!body.password || body.password.length < 6) requestError.push('please provide valid password');
    if (!body.first_name) requestError.push('please provide user first name');
    if (!body.last_name) requestError.push('please provide user last name name');
    if (requestError.length > 0) {
      return Response.failure(res, { message: requestError }, HttpStatus.BAD_REQUEST);
    }
    return this.userService.createUser(body)
      .then(userDetails => Response.success(res, { response: userDetails, message: 'user successfully created' }, HttpStatus.OK))
      .catch((error) => {
        if (error.code === config.MongoErrorCode.duplicateError) {
          return Response.failure(res, { message: 'Email already exist' }, HttpStatus.BAD_REQUEST);
        }
        console.log(error);
        return Response.failure(res, { message: 'Error Creating User' }, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
  loginUser(req, res) {
    const { email, password } = req.body;
    const requestError = [];
    if (!email) requestError.push('please provide email');
    if (!password || password.length < 6) requestError.push('please provide valid password');
    if (requestError.length > 0) {
      return Response.failure(res, { message: requestError }, HttpStatus.BAD_REQUEST);
    }
    return this.userService.loginUser(email, password)
      .then(userDetails => Response.success(res, { response: userDetails, message: 'user successfully logged in' }, HttpStatus.OK))
      .catch((error) => {
        this.logger.error(`this is the login error ${error.message}`);
        Response.failure(res, error, HttpStatus.BAD_REQUEST);
      });
  }
  updateUser(req, res) {
    const { email, password } = req.body;
    const requestError = [];
    if (!email) requestError.push('please provide email');
    if (!password || password.length < 6) requestError.push('please provide valid password');
    if (requestError.length > 0) {
      return Response.failure(res, { message: requestError }, HttpStatus.BAD_REQUEST);
    }
    return this.userService.loginUser(email, password)
      .then(userDetails => Response.success(res, { response: userDetails, message: 'user successfully logged in' }, HttpStatus.OK))
      .catch((error) => {
        this.logger.error(`this is the login error ${error.message}`);
        Response.failure(res, error, HttpStatus.BAD_REQUEST);
      });
  }
  getUser(req, res) {
    const { userId } = req.params;
    const requestError = [];
    if (!userId) {
      requestError.push('no user_id');
    }
    if (requestError.length > 0) {
      return Response.failure(res, { message: requestError }, HttpStatus.BAD_REQUEST);
    }
    return this.userService.getUserDetails(userId)
      .then((userDetails) => {
        this.logger.info(`Fetched User: ${userDetails}`);
        return Response.success(res, { response: userDetails, message: 'user successfully fetched' });
      }).catch((error) => {
        this.logger.error(`Error fetching user: ${error.message}`);
        Response.failure(res, error, HttpStatus.BAD_REQUEST);
      });
  }
  verifyEmail(req, res) {
    const userId = req.params.user_id;
    console.log(userId);
    return this.userService.verifyUser(userId)
      .then((userDetails) => {
        this.logger.info(`Verified User: ${userDetails}`);
        return Response.success(res, { response: userDetails, message: 'email successfully Verified' });
      }).catch((error) => {
        this.logger.error(`Error fetching user: ${error.message}`);
        Response.failure(res, error, HttpStatus.BAD_REQUEST);
      });
  }
}

module.exports = UserController;
