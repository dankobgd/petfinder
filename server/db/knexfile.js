const path = require('path');
require('dotenv').config({ path: '../.env' });

module.exports = {
  development: {
    client: 'pg',
    version: '11',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
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
    version: '11',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
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
