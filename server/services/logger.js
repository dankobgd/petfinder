const fs = require('fs');
const path = require('path');
const { createLogger, transports, format } = require('winston');
const config = require('../config/');
require('winston-daily-rotate-file');

const { logsDir } = config.logging;
const rotateLogsDir = path.join(logsDir, 'timestamps');

function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

createDirIfNotExists(logsDir);

const consoleFmt = format.printf(info => `[${info.timestamp}] - [${info.label}] - ${info.level}: ${info.message}`);

const errorFmt = format.printf(info => {
  if (info.meta && info.meta instanceof Error) {
    return `${info.timestamp} ${info.level} ${info.message} ${info.meta.name} ${info.meta.code} : ${info.meta.stack}`;
  }
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

// Get the filename from where the logger is called
function getModuleFileName(callingModule) {
  return callingModule.filename.match(/[\w-]+\.js/gi)[0];
}

// Transpors options
function getTransport(name, callingModule) {
  const opts = {
    console: {
      level: 'debug',
      handleExceptions: true,
      format: format.combine(
        format.label({ label: getModuleFileName(callingModule) }),
        format.colorize(),
        format.timestamp(),
        consoleFmt
      ),
    },

    info: {
      level: 'info',
      filename: path.join(logsDir, 'combined.log'),
      maxFiles: 5,
      maxsize: 5242880, // 5MB
      handleExceptions: true,
      format: format.combine(
        format.label({ label: getModuleFileName(callingModule) }),
        format.timestamp(),
        format.json()
      ),
    },

    error: {
      level: 'error',
      filename: path.join(logsDir, 'errors.log'),
      maxFiles: 5,
      maxsize: 5242880, // 5MB
      handleExceptions: true,
      format: format.combine(
        format.label({ label: getModuleFileName(callingModule) }),
        format.timestamp(),
        errorFmt,
        format.json()
      ),
    },

    rotate: {
      filename: path.join(logsDir, 'timestamps', '%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '7d',
    },
  };

  return opts[name];
}

// Export logger with specified transports
module.exports = function(module) {
  const infoTransport = new transports.File(getTransport('info', module));
  const errorTransport = new transports.File(getTransport('error', module));
  const consoleTransport = new transports.Console(getTransport('console', module));
  const rotateTransport = new transports.DailyRotateFile(getTransport('rotate', module));

  const transportsArray = [];

  if (config.isProductionMode()) {
    transportsArray.push(infoTransport, errorTransport);
  }

  if (config.isProductionMode() && config.logging.rotateLogs.enabled) {
    createDirIfNotExists(rotateLogsDir);
    transportsArray.push(rotateTransport);
  }

  if (!config.isProductionMode() && config.logging.console.enabled) {
    transportsArray.push(consoleTransport);
  }

  const logger = createLogger({
    transports: transportsArray,
  });

  logger.stream = {
    write(message, encoding) {
      logger.info(JSON.parse(message));
    },
  };

  return logger;
};
