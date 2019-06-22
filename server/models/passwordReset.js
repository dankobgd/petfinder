const createModel = require('../utils/create-model-skeleton.js');

const name = 'PasswordReset';
const tableName = 'password_reset';
const selectableProps = ['id', 'user_id', 'token', 'expires'];

module.exports = knex => {
  const base = createModel({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const validateToken = async token => {
    const isValid = await knex('password_reset')
      .where({ token })
      .andWhere('expires', '>', Date.now())
      .first();

    if (!isValid) {
      return Promise.reject(new Error('Password reset token is invalid, or has already expired'));
    }

    return Promise.resolve(isValid);
  };

  return {
    ...base,
    validateToken,
  };
};
