const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, './petfinder.db'),
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, './migrations/'),
      seeds: path.join(__dirname, './seeds/'),
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    version: '7.2',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
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
};
