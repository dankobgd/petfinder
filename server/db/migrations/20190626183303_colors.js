exports.up = knex =>
  knex.schema.createTable('colors', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.string('primary').notNullable();
    t.string('secondary');
    t.string('tertiary');
  });

exports.down = knex => knex.schema.dropTable('colors');
