exports.up = knex =>
  knex.schema.createTable('users', t => {
    t.increments('id').primary();
    t.string('username').notNullable();
    t.string('email').notNullable();
    t.string('password').notNullable();
    t.boolean('is_active')
      .notNullable()
      .defaultTo(true);
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('users');
