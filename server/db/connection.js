const knex = require('knex');
const config = require('../config');
const databaseConfig = require('./knexfile');

const environmentConfig = databaseConfig[config.app.env];
const connection = knex(environmentConfig);

// Log raw SQL queries
connection.on('query', data => {
  console.info({ bindings: data.bindings, sql: data.sql });
});

module.exports = connection;
