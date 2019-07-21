exports.up = knex =>
  knex.schema.createTable('images', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.string('url');
  });

exports.down = knex => knex.schema.dropTable('images');
