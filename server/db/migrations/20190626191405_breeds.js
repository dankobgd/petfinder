exports.up = knex =>
  knex.schema.createTable('breeds', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.string('primary');
    t.string('secondary');
    t.boolean('mixed');
    t.boolean('unknown');
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('breeds');
