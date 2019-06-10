const _ = require('lodash');
const createError = require('http-errors');
const logger = require('../services/logger')(module);
const config = require('../config');

module.exports = app => {
  app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
  });

  app.use((err, req, res, next) => {
    const { name, message, statusCode, status, code, stack, ...rest } = err;

    const e = {
      meta: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      error: {
        type: name,
        status_code: statusCode || status || 500,
        message,
        code: code || undefined,
        data: {
          stack,
          ...rest,
        },
      },
    };

    logger.error('Error occurred', e);
    res.status(e.error.status_code);

    if (config.isDevelopmentMode()) {
      return res.json({ success: false, ..._.omit(e.error, ['data.expose', 'data.stack']) });
    }

    if (config.isProductionMode()) {
      return res.json({ success: false, ..._.omit(e.error, ['data']) });
    }
  });
};
