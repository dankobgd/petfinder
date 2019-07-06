const os = require('os');
const morgan = require('morgan');
const logger = require('../services/logger');
const config = require('../config');

module.exports = app => {
  // Create custom tokens
  morgan.token('hostname', () => os.hostname());
  morgan.token('pid', () => process.pid);

  // JSON request format
  function jsonFormat(tokens, req, res) {
    return JSON.stringify({
      remote_address: tokens['remote-addr'](req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      http_version: tokens['http-version'](req, res),
      status_code: tokens.status(req, res),
      content_length: tokens.res(req, res, 'content-length'),
      referrer: tokens.referrer(req, res),
      user_agent: tokens['user-agent'](req, res),
      hostname: tokens.hostname(req, res),
      pid: tokens.pid(req, res),
    });
  }

  // Output to winston stream
  if (config.isProductionMode()) {
    app.use(morgan(jsonFormat, { stream: logger.stream }));
  } else {
    app.use(morgan('dev'));
  }
};
