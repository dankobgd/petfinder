const faker = require('faker');
const data = require('../seed-helpers/data');
const getRandomItem = require('../seed-helpers/getRandomItem');

const NUM_USERS = 50;
const NUM_TAGS = 50;
const NUM_MICROPCHIP = 30;
const NUM_ANIMALS = 200;

const nullable = val => (Math.random() < 0.5 ? val : null);
const genArr = (length, seedFn) => Array.from({ length }, seedFn);

const createUser = () => ({
  username: faker.name.firstName(),
  email: faker.internet.email(),
  password: '$2a$12$Xrvbj13hyv2rBidkJVim5e4BDn3Gkd3RTrW3fffVgt/HlruPyEAw2',
});

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

const createContacts = idx => ({
  animal_id: idx,
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

const createAnimals = ids => {
  const type = getRandomItem(data.common.types);
  const species = getRandomItem(data.common.species);

  const getSpeciesArr = t =>
    ({
      Cat: data.cat.breeds,
      Dog: data.dog.breeds,
      Rabbit: data.rabbit.breeds,
      'Small & Furry': data.smallAndFurry.collection[0].breed,
      'Aquatic & Reptiles': data.aquaticAndReptiles.collection[0].breed,
    }[t]);

  const getBreedArr = t =>
    ({
      Cat: data.cat.breeds,
      Dog: data.dog.breeds,
      Rabbit: data.rabbit.breeds,
      'Small & Furry': data.smallAndFurry.collection[0].breed,
      'Aquatic & Reptiles': data.aquaticAndReptiles.collection[0].breed,
    }[t]);

  const breedArr = getBreedArr(type);

  return {
    type,
    user_id: faker.random.arrayElement(ids),
    name: faker.internet.userName(),
    species: getRandomItem(data.common.species),
    gender: getRandomItem(data.common.gender),
    age: getRandomItem(data.common.age),
    coat_length: getRandomItem(data.common.coatLength),
    size: getRandomItem(data.common.size),
    image_url: 'https://res.cloudinary.com/dankobgd/image/upload/v1563729655/sample.jpg',
    description: faker.lorem.sentence(),
    declawed: faker.random.boolean(),
    vaccinated: faker.random.boolean(),
    house_trained: faker.random.boolean(),
    special_needs: faker.random.boolean(),
    spayed_neutered: faker.random.boolean(),
    good_with_kids: faker.random.boolean(),
    good_with_cats: faker.random.boolean(),
    good_with_dogs: faker.random.boolean(),
    primary_breed: getRandomItem(breedArr),
    secondary_breed: nullable(getRandomItem(breedArr)),
    mixed_breed: faker.random.boolean(),
    unknown_breed: faker.random.boolean(),
    status: 'Adoptable',
  };
};

exports.seed = async knex => {
  const pluck = (table, field) =>
    knex
      .distinct()
      .from(table)
      .pluck(field);

  const test = {
    username: 'test',
    email: 'test@test.com',
    password: '$2a$12$Xrvbj13hyv2rBidkJVim5e4BDn3Gkd3RTrW3fffVgt/HlruPyEAw2',
  };

  // Clean all previous data first before seed
  await knex.migrate.rollback();
  await knex.migrate.latest();

  const fakeUsers = [test, ...genArr(NUM_USERS, createUser)];
  await knex('users').insert(fakeUsers);
  const uids = await pluck('users', 'id');

  const fakeAnimals = genArr(NUM_ANIMALS, () => createAnimals(uids));
  await knex('animals').insert(fakeAnimals);
  const ids = await pluck('animals', 'id');

  const fakeContacts = [];
  for (let i = 0; i < ids.length; i++) {
    fakeContacts.push(createContacts(i + 1));
  }

  const fakeTags = genArr(NUM_TAGS, () => createTag(ids));
  const fakeColors = genArr(NUM_ANIMALS, () => createColors(ids));
  const fakeMicrochip = genArr(NUM_MICROPCHIP, () => createMicrochip(ids));

  await knex('contacts').insert(fakeContacts);
  await knex('tags').insert(fakeTags);
  await knex('colors').insert(fakeColors);
  await knex('microchip').insert(fakeMicrochip);
};
