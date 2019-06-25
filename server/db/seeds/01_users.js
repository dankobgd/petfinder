exports.seed = async knex => {
  const users = [
    { username: 'test', email: 'test@gmail.com', password: 'test' },
    { username: 'bob', email: 'bob@yahoo.com', password: 'eJqZK56cwViHQw5;' },
    { username: 'john', email: 'john@hotmail.com', password: 'nNI_zv0dw5GNoTP;' },
    { username: 'cindy', email: 'cindy@gmail.com', password: 'qmaWWO7z4pcqFNP;' },
    { username: 'julie', email: 'julie@gmail.com', password: 'P5_tOIq8rriLn5V;' },
  ];

  await knex('users').del();
  return knex('users').insert(users);
};
