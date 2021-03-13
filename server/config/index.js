const path = require('path');
const merge = require('lodash/merge');
const pkg = require('../package.json');
require('dotenv').config();

// Base configuration
const baseConfig = {
  isDevelopmentMode() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  },
  isProductionMode() {
    return process.env.NODE_ENV === 'production';
  },
  isTestMode() {
    return process.env.NODE_ENV === 'test';
  },

  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3737,
    siteUrl: process.env.SITE_URL,
    title: pkg.title,
    version: pkg.version,
    description: pkg.description,
    keywords: pkg.keywords,
  },

  auth: {
    verificationRequired: true,
    resetPasswordValidFor: 60 * 60 * 1000, // 1 hour
    jwtSecret: process.env.JWT_SECRET || 'secret',
  },

  sessions: {
    name: 'SessionID',
    secret: process.env.SESSION_SECRET || 'xxx',
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  },

  email: {
    enabled: process.env.NODE_ENV === 'production',
    from: process.env.EMAIL_FROM,
    signatureAddress: process.env.SIGNATURE_ADDRESS,
    smtp: {
      tls: {
        rejectUnauthorized: false,
      },
    },
  },

  logging: {
    logsDir: path.resolve(__dirname, '..', 'logs'),
    console: {
      enabled: true,
    },
    file: {},
    rotateLogs: {
      enabled: false,
    },
  },

  file: {
    uploadLimit: 1024 * 1024 * 10, // 10MB
    allowedMimeTypes: /jpg|jpeg|png|bmp|gif/,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  geocodingApiKey: process.env.GEOCODING_API_KEY,
};

// Development configuration
const developmentConfig = {
  email: {
    smtp: {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    },
  },
};

// Production configuration
const productionConfig = {
  email: {
    smtp: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },
  },
};

// Return current ENV config
function getEnvironmentConfig(env) {
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'production':
      return productionConfig;
    default:
      return productionConfig;
  }
}

// Export merged config
const cfg = getEnvironmentConfig(baseConfig.app.env);
module.exports = merge(baseConfig, cfg);
