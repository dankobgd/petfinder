const path = require('path');
require('dotenv').config({ path: '../.env' });

module.exports = {
  development: {
    client: 'pg',
    version: '13',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations/',
      seeds: './seeds/',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    version: '13',
    connection: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, './migrations/'),
      seeds: path.join(__dirname, './seeds/'),
    },

    useNullAsDefault: true,
  },
};
