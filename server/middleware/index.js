const errorHandler = require('./errorHandler');
const requestLogger = require('./requestLogger');
const validate = require('./validateRequest');
const authGard = require('./authGard');
const setGlobalVars = require('./setGlobalVars');
const uploadFile = require('./uploadFile');

module.exports = {
  errorHandler,
  requestLogger,
  validate,
  authGard,
  setGlobalVars,
  uploadFile,
};
