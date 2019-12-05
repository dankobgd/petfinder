exports.up = knex =>
  knex.schema.createTable('contacts', t => {
    t.increments('id').primary();
    t.integer('animal_id')
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE');
    t.string('phone').notNullable();
    t.string('email').notNullable();
    t.string('country').notNullable();
    t.string('city').notNullable();
    t.string('address').notNullable();
    t.string('zip').notNullable();
    t.float('lat', 11, 8).notNullable();
    t.float('lng', 11, 8).notNullable();
    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('deleted_at');
  });

exports.down = knex => knex.schema.dropTable('contacts');
