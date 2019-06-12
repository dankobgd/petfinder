const omit = require('lodash/omit')
const knex = require('../../db/connection');

module.exports = {
  async getOne(id) {
    return knex('users')
      .where('id', id)
      .first();
  },

  toAuthJSON(user) {
    return omit(user, ['password']);
  },
};
