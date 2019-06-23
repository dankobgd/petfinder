const jwt = require('jsonwebtoken');
const mailer = require('../../services/mailer');
const config = require('../../config');

module.exports = {
  signJWT(user) {
    return jwt.sign(
      {
        iss: config.app.title,
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
      },
      config.auth.jwtSecret
    );
  },

  sendResetPasswordEmail(data) {
    return mailer.send('reset-password', data);
  },

  sendPasswordChangedEmail(data) {
    return mailer.send('reset-password-completed', data);
  },
};
