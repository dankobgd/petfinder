exports.up = knex =>
  knex.schema.createTable('animals', t => {
    t.increments('id').primary();
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // common
    t.string('name').notNullable();
    t.string('type').notNullable();
    t.string('species').notNullable();
    t.string('gender').notNullable();
    t.string('age').notNullable();
    t.string('coat_length').notNullable();
    t.string('size').notNullable();
    t.string('image_url').notNullable();
    t.string('description');
    t.boolean('adopted').notNullable();

    // attributes
    t.boolean('declawed').defaultTo(0);
    t.boolean('vaccinated').defaultTo(0);
    t.boolean('special_needs').defaultTo(0);
    t.boolean('house_trained').defaultTo(0);
    t.boolean('spayed_neutered').defaultTo(0);
    t.boolean('good_with_kids').defaultTo(1);
    t.boolean('good_with_cats').defaultTo(1);
    t.boolean('good_with_dogs').defaultTo(1);

    // breeds
    t.string('primary_breed');
    t.string('secondary_breed');
    t.boolean('mixed_breed').defaultTo(0);
    t.boolean('unknown_breed').defaultTo(0);

    // likes
    t.integer('likes_count').defaultTo(0);

    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('animals');
