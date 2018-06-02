/* eslint-disable no-underscore-dangle */


const usersModel = require('../models/User');
const applicatntModel = require('../models/Transaction');
const employerModel = require('../models/Employer');
const MongoDBHelper = require('../lib/mongoDBHelper');
const utilityHelper = require('../lib/utilityHelper');
const config = require('../config/settings');

class UserService {
  constructor(logger, mongo) {
    this.logger = logger;
    this.usersMongoDBHelper = new MongoDBHelper(mongo, usersModel);
    this.employerMongoDBHelper = new MongoDBHelper(mongo, employerModel);
    this.applicantMongoDBHelper = new MongoDBHelper(mongo, applicatntModel);
  }


  createUser(userDetails) {
    this.logger.info(`creating user: ${JSON.stringify(userDetails)}`);
    const user = {
      email: userDetails.email,
      password: userDetails.password,
      status: config.userStatus.NEW_USER,
      user_type: userDetails.usertype
    };
    return this.usersMongoDBHelper.save(user)
      .then((savedUser) => {
        if (userDetails.usertype === config.userType.employer) {
          const employer = {
            email: userDetails.email,
            name: userDetails.company_name,
            user_id: savedUser._id,
            sector: userDetails.sector,
            workforce_size: userDetails.workforce_size,
            address: userDetails.address,
            city: userDetails.city,
            country: userDetails.country
          };
          return this.saveEmployer(employer)
            .then(() => {
              const data = {
                userId: savedUser._id
              };
              const token = utilityHelper.generateToken(data);
              return { token, userId: savedUser._id, userType: savedUser.user_type };
            });
        }
        const applicant = {
          email: userDetails.email,
          first_name: userDetails.firstname,
          last_name: userDetails.lastname,
          user_id: savedUser._id,
          job_role: userDetails.job_role,
          address: userDetails.address,
          picture_url: userDetails.picture_url,
          city: userDetails.city,
          experience_level: userDetails.experience_level,
          country: userDetails.country
        };
        return this.saveApplicant(applicant)
          .then(() => {
            const data = {
              userId: savedUser._id
            };
            const token = utilityHelper.generateToken(data);
            return { token, userId: savedUser._id, userType: savedUser.user_type };
          });
      });
  }


  loginUser(email, password) {
    const param = {};
    param.conditions = { email };
    return this.usersMongoDBHelper.getOneOptimised(param)
      .then((user) => {
        if (user) {
          if (user.password === password) {
            const token = utilityHelper.generateToken({ userId: user._id });
            return { token, userId: user._id, userType: user.user_type };
          }
          throw new Error('Invalid Email address or password');
        }
        throw new Error('Invalid Email address');
      });
  }
  verifyUser(userId) {
    const param = {};
    param.conditions = { _id: userId };
    const data = { status: config.userStatus.EMAIL_VERIFIED };
    return this.usersMongoDBHelper.update(param, data);
  }

  saveEmployer(employer) {
    return this.employerMongoDBHelper.save(employer);
  }
  saveApplicant(applicant) {
    return this.applicantMongoDBHelper.save(applicant);
  }
  updateEmployer(employer) {
  }
  updateApplicant(applicant) {
  }
  getUserDetails(userId) {
    const param = {};
    param.conditions = { _id: userId };
    return this.usersMongoDBHelper.getOneOptimised(param)
      .then((user) => {
        if (user) {
          const params = {};
          params.conditions = { user_id: user._id };
          if (user.user_type === config.userType.applicant) {
            return this.applicantMongoDBHelper.getOneOptimised(params);
          }
          return this.employerMongoDBHelper.getOneOptimised(params);
        }
        throw new Error('User id does not exist');
      }).catch(() => {
        throw new Error('User id does not exist');
      });
  }
}

module.exports = UserService;

