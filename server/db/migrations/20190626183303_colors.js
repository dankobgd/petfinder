exports.up = knex =>
  knex.schema.createTable('attributes', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.string('primary').notNullable();
    t.string('secondary');
    t.string('tertiary');
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('attributes');
