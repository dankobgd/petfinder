exports.up = knex =>
  knex.schema.createTable('likes', t => {
    t.integer('user_id')
      .references('id')
      .inTable('users');
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.primary(['user_id', 'animal_id']);
  });

exports.down = knex => knex.schema.dropTable('likes');
