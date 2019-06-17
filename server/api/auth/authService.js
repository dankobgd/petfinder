const jwt = require('jsonwebtoken');
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
};
