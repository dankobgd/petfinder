exports.up = knex =>
  knex.schema.createTable('attributes', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals');
    t.boolean('declawed').notNullable();
    t.boolean('vaccinated').notNullable();
    t.boolean('special_needs').notNullable();
    t.boolean('house_trained').notNullable();
    t.boolean('spayed_neutered').notNullable();
    t.boolean('good_with_kids').notNullable();
    t.boolean('good_with_dogs').notNullable();
    t.boolean('good_with_cats').notNullable();
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('attributes');
