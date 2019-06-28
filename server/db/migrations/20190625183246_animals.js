exports.up = knex =>
  knex.schema.createTable('animals', t => {
    t.increments('id').primary();
    t.integer('user_id')
      .references('id')
      .inTable('users');
    t.string('name').notNullable();
    t.string('type').notNullable();
    t.string('species').notNullable();
    t.string('gender').notNullable();
    t.string('age').notNullable();
    t.string('coat').notNullable();
    t.string('size').notNullable();
    t.string('description').notNullable();
    t.string('status').notNullable();
    t.string('imageUrl').notNullable();
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('animals');
