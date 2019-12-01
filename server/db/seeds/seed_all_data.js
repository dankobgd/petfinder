const faker = require('faker');
const data = require('../seed-helpers/data');
const getRandomItem = require('../seed-helpers/getRandomItem');
const { animals } = require('./animals.json');

const nullable = val => (Math.random() < 0.5 ? val : null);
const genArr = (length, seedFn) => Array.from({ length }, seedFn);

const testUser = {
  username: 'test',
  email: 'test@test.com',
  password: '$2a$12$Xrvbj13hyv2rBidkJVim5e4BDn3Gkd3RTrW3fffVgt/HlruPyEAw2',
};

const createTag = ids => ({
  animal_id: faker.random.arrayElement(ids),
  text: faker.lorem.word(),
});

const createMicrochip = ids => ({
  animal_id: faker.random.arrayElement(ids),
  number: faker.random.number(),
  brand: nullable(faker.company.bsNoun()),
  description: nullable(faker.lorem.sentence()),
  location: nullable(faker.lorem.sentence()),
});

const createContacts = i => ({
  animal_id: i,
  phone: faker.phone.phoneNumberFormat(1),
  email: faker.internet.email(),
  country: faker.address.country(),
  city: faker.address.city(),
  address: faker.address.streetAddress(),
  zip: faker.address.zipCode(),
  lat: faker.address.latitude(),
  lng: faker.address.longitude(),
});

const createColors = ids => ({
  animal_id: faker.random.arrayElement(ids),
  color: getRandomItem(data.cat.colors),
});

const createAnimals = (elm, idsArr) => ({
  user_id: faker.random.arrayElement(idsArr),
  name: elm.name || faker.name.findName(),
  type: elm.type,
  species: elm.species,
  gender: elm.gender,
  age: elm.age,
  size: elm.size,
  coat_length: getRandomItem(data.common.coatLength),
  image_url: elm.photos[0].full || elm.photos[0].large || elm.photos[0].medium || elm.photos[0].small,
  description: elm.description || faker.lorem.sentence(),
  declawed: faker.random.boolean(),
  vaccinated: faker.random.boolean(),
  house_trained: faker.random.boolean(),
  special_needs: faker.random.boolean(),
  spayed_neutered: faker.random.boolean(),
  good_with_kids: faker.random.boolean(),
  good_with_cats: faker.random.boolean(),
  good_with_dogs: faker.random.boolean(),
  primary_breed: elm.breeds.primary,
  secondary_breed: elm.breeds.secondary,
  mixed_breed: elm.breeds.mixed,
  unknown_breed: elm.breeds.unknown,
  adopted: false,
});

exports.seed = async knex => {
  // eslint-disable-next-line
  const pluck = (table, field) => knex.distinct().from(table).pluck(field);

  // Start with clean data
  await knex.migrate.rollback();
  await knex.migrate.latest();

  const fakeUsers = [testUser];
  for (let i = 0; i < 50; i++) {
    fakeUsers.push({
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: '$2a$12$Xrvbj13hyv2rBidkJVim5e4BDn3Gkd3RTrW3fffVgt/HlruPyEAw2',
    });
  }
  await knex('users').insert(fakeUsers);
  const uids = await pluck('users', 'id');

  const withPhotos = animals.filter(x => x.photos.length);
  const fakeAnimals = withPhotos.map(elm => createAnimals(elm, uids));
  await knex('animals').insert(fakeAnimals);
  const ids = await pluck('animals', 'id');

  const fakeContacts = [];
  for (let i = 0; i < ids.length; i++) {
    fakeContacts.push(createContacts(i + 1));
  }

  const fakeTags = genArr(50, () => createTag(ids));
  const fakeColors = genArr(fakeAnimals.length, () => createColors(ids));
  const fakeMicrochip = genArr(30, () => createMicrochip(ids));

  await knex('contacts').insert(fakeContacts);
  await knex('tags').insert(fakeTags);
  await knex('colors').insert(fakeColors);
  await knex('microchip').insert(fakeMicrochip);
};
