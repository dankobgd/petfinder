const knex = require('knex');
const config = require('../config');
const databaseConfig = require('./knexfile');

const environmentConfig = databaseConfig[config.app.env];
const connection = knex(environmentConfig);

module.exports = connection;
