const bcrypt = require('bcryptjs');
const createModel = require('../utils/create-model-skeleton');

const name = 'User';
const tableName = 'users';
const selectableProps = ['id', 'username', 'email', 'is_active', 'updated_at', 'created_at', 'deleted_at'];

const hashPassword = pw =>
  new Promise((resolve, reject) => {
    const SALT_ROUNDS = 12;
    bcrypt.hash(pw, SALT_ROUNDS, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });

const verifyHash = (pw, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(pw, hash, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });

const beforeSave = async user => {
  if (!user.password) return Promise.resolve(user);
  const hash = await hashPassword(user.password);

  return {
    ...user,
    password: hash,
  };
};

module.exports = knex => {
  const base = createModel({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = async props => {
    const user = await beforeSave(props);
    const insertedId = await knex('users')
      .insert(user)
      .timeout(base.timeout);

    return base.findOne({ id: insertedId[0] });
  };

  const verify = async (email, password) => {
    const user = await knex('users')
      .where({ email })
      .first()
      .timeout(base.timeout);

    if (!user) {
      return Promise.reject(new Error('User does not exist'));
    }

    const isMatch = await verifyHash(password, user.password);
    if (!isMatch) {
      return Promise.reject(new Error('Invalid password'));
    }

    const userWithoutPw = { ...user };
    delete userWithoutPw.password;
    return Promise.resolve(userWithoutPw);
  };

  const updatePassword = async (id, props) => {
    const hashed = await hashPassword(props.password);
    const data = {
      ...props,
      password: hashed,
    };

    await base.update(id, data);
    return base.findOne({ id });
  };

  return {
    ...base,
    create,
    verify,
    updatePassword,
  };
};
