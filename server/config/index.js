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
    port: process.env.PORT || 3001,
    title: pkg.title,
    version: pkg.version,
    description: pkg.description,
    keywords: pkg.keywords,
  },

  auth: {
    verificationRequired: true,
    resetPasswordValidFor: 60 * 60 * 1000, // 1 hour
    jwtSecret: process.env.JWT_SECRET || 'secret',
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
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
    enabled: false,
    transport: 'smtp', // `smtp | mailgun | sendgrid`
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
    uploadLimit: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
  },

  analytics: {
    google: 'xxx-xxx',
  },
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
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
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
