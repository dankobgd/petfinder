exports.up = knex =>
  knex.schema.createTable('microchip', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.string('id');
    t.string('brand');
    t.string('description');
    t.string('location');
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('microchip');
