exports.up = knex =>
  knex.schema.createTable('tags', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE');
    t.string('text');
  });

exports.down = knex => knex.schema.dropTable('tags');
