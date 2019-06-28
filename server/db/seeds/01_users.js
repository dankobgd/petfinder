exports.seed = async knex => {
  const users = [
    {
      username: 'test',
      email: 'test@gmail.com',
      password: '$2a$12$BDtrmN20PD3DclA7fmIUQ.OLEYA0UDP4vhytjocEfgNuGb2HwSveq',
    },
    {
      username: 'bob',
      email: 'bob@yahoo.com',
      password: '$2a$12$IFlmDGbORr9aSwsRRSqFJu2unKXW7pL68HbLoupbfLEAuCGXEVN6S;',
    },
    {
      username: 'john',
      email: 'john@hotmail.com',
      password: '$2a$12$WK65xQD/KjUl3x4kZN789.6HRnRIUlskGkto4hoUx01J72JRzAK3i;',
    },
    {
      username: 'cindy',
      email: 'cindy@gmail.com',
      password: '$2a$12$TiHIjXbsxlr4bKn7i/2HhODBHIQm4KcROuchxrcTFj9q4em6f5acK;',
    },
    {
      username: 'julie',
      email: 'julie@gmail.com',
      password: '$2a$12$WPiehDzESow49.smag7OXuVHA3uax.Ml9h0UK.2RnU1WzyhZJ7xFK;',
    },
  ];

  await knex('users').del();
  return knex('users').insert(users);
};
