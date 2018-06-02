

const config = require('../config/settings');
const jwt = require('jsonwebtoken');


class Utility {
  /**
   * Generates Token to be sent back to client
   * @param {*} data payload
   */
  static generateToken(data) {
    const token = jwt.sign(
      data,
      config.TokenSigning.secret,
      {
        algorithm: config.TokenSigning.algorithm,
      }
    );
    return token;
  }
  /**
   * decdde Token
   * @param {*} token
   */
  static decodeToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        config.TokenSigning.secret,
        {
          algorithm: config.TokenSigning.algorithm,
        },
        (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        }
      );
    });
  }
}

module.exports = Utility;
