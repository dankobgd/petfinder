const jwt = require('jsonwebtoken');
const createErorr = require('http-errors');
const config = require('../config');

function requireJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-access-token'];

  if (!authHeader) {
    return next(createErorr.Unauthorized('Unauthorized access, no authorization header provided'));
  }

  const [authScheme, accessToken] = authHeader.split(' ');

  if (authScheme.trim() !== 'Bearer') {
    return next(createErorr.Unauthorized('Invalid authentication scheme type'));
  }

  if (!accessToken) {
    return next(createErorr.Unauthorized('Unauthorized access, no authorization token provided'));
  }

  try {
    const decoded = jwt.verify(accessToken, config.auth.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createErorr.Unauthorized('Invalid authorization token'));
  }
}

module.exports = {
  requireJWT,
};
