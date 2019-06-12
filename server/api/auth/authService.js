const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const omit = require('lodash/omit');
const knex = require('../../db/connection');
const config = require('../../config');

function hashPassword(pw) {
  const saltFactor = 12;
  const salt = bcrypt.genSaltSync(saltFactor);
  const hash = bcrypt.hashSync(pw, salt);
  return hash;
}

function verifyHash(pw1, pw2) {
  return bcrypt.compareSync(pw1, pw2);
}

module.exports = {
  async getOne(email) {
    return knex('users')
      .where('email', email)
      .first();
  },

  async createUser(data) {
    const newUser = {
      username: data.username,
      email: data.email,
      password: hashPassword(data.password),
    };

    await knex('users').insert(newUser);

    return knex('users')
      .where('email', data.email)
      .first();
  },

  comparePassword(...args) {
    return verifyHash(...args);
  },

  toAuthJSON(user) {
    return omit(user, ['password']);
  },

  signJWT(user) {
    return jwt.sign(
      {
        iss: 'petfinder',
        sub: user.id,
        iat: new Date().getTime(),
        epx: new Date().setDate(new Date().getDate() + 1),
      },
      config.auth.jwtSecret
    );
  },
};
