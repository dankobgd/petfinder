exports.up = knex =>
  knex.schema.createTable('password_reset', t => {
    t.increments('id').primary();
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable();
    t.datetime('token');
    t.datetime('expires');
  });

exports.down = knex => knex.schema.dropTable('password_reset');
