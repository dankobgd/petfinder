const { format } = require('util');
const knex = require('knex');
const config = require('../config');
const databaseConfig = require('./knexfile');

const environmentConfig = databaseConfig[config.app.env];
const connection = knex(environmentConfig);

// Log raw SQL queries
// connection.on('query', q => {
//   console.info(format('\nBINDINGS: %j\nSQL: %s\n', q.bindings, q.sql));
// });

module.exports = connection;
