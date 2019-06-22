const errorHandler = require('./error-handler');
const requestLogger = require('./request-logger');
const validate = require('./validate-request');
const authGard = require('./authGard');
const setGlobalVars = require('./setGlobalVars');

module.exports = {
  errorHandler,
  requestLogger,
  validate,
  authGard,
  setGlobalVars,
};
