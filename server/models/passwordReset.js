const createModel = require('../utils/create-model-skeleton.js');

const name = 'PasswordReset';
const tableName = 'password_reset';
const selectableProps = ['id', 'token', 'expires'];

module.exports = knex => {
  const base = createModel({
    knex,
    name,
    tableName,
    selectableProps,
  });

  return {
    ...base,
  };
};
