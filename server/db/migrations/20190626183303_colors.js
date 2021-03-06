exports.up = knex =>
  knex.schema.createTable('colors', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE');
    t.string('color').notNullable();
  });

exports.down = knex => knex.schema.dropTable('colors');
