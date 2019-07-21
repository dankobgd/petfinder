exports.up = knex =>
  knex.schema.createTable('microchip', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.string('number');
    t.string('brand');
    t.string('description');
    t.string('location');
  });

exports.down = knex => knex.schema.dropTable('microchip');
