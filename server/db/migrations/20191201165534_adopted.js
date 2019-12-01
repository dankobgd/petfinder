exports.up = knex =>
  knex.schema.createTable('adopted', t => {
    t.increments('id').primary();
    t.integer('user_id')
      .references('id')
      .inTable('users');
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
  });

exports.down = knex => knex.schema.dropTable('adopted');
