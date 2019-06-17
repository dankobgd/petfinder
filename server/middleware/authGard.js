const jwt = require('jsonwebtoken');
const createErorr = require('http-errors');
const config = require('../config');

function requireJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-access-token'];

  if (!authHeader) {
    return next(createErorr(401, 'No authorization header provided, access denied'));
  }

  const [authScheme, token] = authHeader.split(' ');

  if (authScheme.trim() !== 'Bearer') {
    return next(createErorr(401, 'Invalid authentication scheme type'));
  }

  if (!token) {
    return next(createErorr(401, 'No authorization token provided, access denied'));
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createErorr(401, 'Invalid authorization token'));
  }
}

module.exports = {
  requireJWT,
};
