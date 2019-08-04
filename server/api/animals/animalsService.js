const request = require('request');
const _ = require('lodash');
const { cloudinaryUpload } = require('../../services/cloudinary');
const config = require('../../config');
const knex = require('../../db/connection');

function toLowerCase(obj) {
  const arr = Object.entries(obj).map(([k, v]) => {
    if (typeof v === 'string') {
      return [k, v.toLowerCase()];
    }
    if (Array.isArray(v)) {
      const lowerVal = v.map(x => x.toLowerCase());
      return [k, lowerVal];
    }
  });

  return Object.fromEntries(arr);
}

function createDynamicQuery(queries, bindings) {
  return function(val, stm) {
    if (val) {
      const andQuery = `AND ${stm} = ?`;
      const orQuery = `OR ${stm} = ?`;

      if (Array.isArray(val)) {
        const [first, ...rest] = val;
        queries.push(andQuery);
        bindings.push(first);
        rest.forEach(x => {
          queries.push(orQuery);
          bindings.push(x);
        });
      } else {
        queries.push(andQuery);
        bindings.push(val);
      }
    }
  };
}

module.exports = {
  async uploadPetImage(file) {
    const { originalname, buffer } = file;

    // trim file extension
    const filename = originalname.replace(/\.[^/.]+$/, '');

    const cloudinaryOpts = {
      folder: 'petfinder/pets',
      public_id: `${Date.now()}-${filename}`,
    };

    return cloudinaryUpload(buffer, cloudinaryOpts);
  },

  async getCoordsFromAddress(address) {
    return new Promise((resolve, reject) => {
      const adr = encodeURIComponent(address);
      const geocodeURI = `https://us1.locationiq.org/v1/search.php?key=${config.geocodingApiKey}&format=json&q=${adr}`;

      request(geocodeURI, (error, response, body) => {
        if (error) return reject(error);
        resolve(JSON.parse(body));
      });
    });
  },

  async createPet(obj) {
    const data = {};

    Object.entries(obj).forEach(([key, val]) => {
      if (!val || val === 'undefined') {
        data[[key]] = null;
      } else {
        data[[key]] = val;
      }
    });

    const target = [
      'declawed',
      'house_trained',
      'special_needs',
      'vaccinated',
      'spayed_neutered',
      'good_with_kids',
      'good_with_cats',
      'good_with_dogs',
    ];

    const providedAttrs = data.attributes ? data.attributes.split(',') : [];
    const providedEnv = data.environment ? data.environment.split(',') : [];
    const provided = [...providedAttrs, ...providedEnv];
    const petAttributes = {};

    _.intersection(target, provided).forEach(item => {
      if (item.startsWith('good')) {
        petAttributes[[item]] = Number(!item);
      } else {
        petAttributes[[item]] = Number(!!item);
      }
    });

    const animalId = await knex('animals').insert({
      user_id: data.user_id,
      name: data.name,
      type: data.type,
      species: data.species,
      gender: data.gender,
      age: data.age,
      coatLength: data.coatLength,
      size: data.size,
      description: data.description,
      imageUrl: data.imageUrl,
      status: 'adoptable',
      primaryBreed: data.primaryBreed,
      secondaryBreed: data.secondaryBreed,
      mixedBreed: Number(!!data.mixedBreed),
      unknownBreed: Number(!!data.unknownBreed),
      ...petAttributes,
    });

    await knex('contacts').insert({
      animal_id: animalId[0],
      phone: data.phone,
      email: data.email,
      country: data.country,
      city: data.city,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      zip: '11000',
    });

    const c = obj.colors.split(',').map(color => knex('colors').insert({ animal_id: animalId[0], color }));
    await Promise.all(c);

    if (data.attributes && data.attributes.includes('microchip')) {
      await knex('microchip').insert({
        animal_id: animalId[0],
        number: data.chipId,
        brand: data.chipBrand,
        location: data.chipLocation,
        description: data.chipDescription,
      });
    }

    if (obj.gallery && obj.gallery.length) {
      const p = obj.gallery.map(url => knex('images').insert({ animal_id: animalId[0], url }));
      await Promise.all(p);
    }

    if (obj.tags && obj.tags.length) {
      const p = obj.tags.split(',').map(text => knex('tags').insert({ animal_id: animalId[0], text }));
      await Promise.all(p);
    }
  },

  getAnimals() {
    return knex('animals');
  },

  getSingleAnimal(id) {
    return knex('animals').where({ id });
  },

  async getSearchFilterResults(payload) {
    const options = toLowerCase(payload);

    const queries = [
      `
      SELECT a.id,
          a.user_id,
          a.name,
          a.type,
          a.species,
          a.gender,
          a.age,
          a.coatLength,
          a.size,
          a.status,
          a.imageUrl,
          a.description,
          a.declawed,
          a.vaccinated,
          a.special_needs,
          a.house_trained,
          a.spayed_neutered,
          a.good_with_kids,
          a.good_with_cats,
          a.good_with_dogs,
          a.primaryBreed,
          a.secondaryBreed,
          a.mixedBreed,
          a.unknownBreed,
          a.created_at,
          a.updated_at,
          contacts.animal_id,
          contacts.phone,
          contacts.email,
          contacts.country,
          contacts.city,
          contacts.address,
          contacts.zip,
          contacts.lat,
          contacts.lng,
          GROUP_CONCAT(DISTINCT tags.text) AS tags,
          GROUP_CONCAT(DISTINCT images.url) AS images,
          GROUP_CONCAT(DISTINCT colors.color) AS colors
      FROM animals as a
          LEFT JOIN contacts ON a.id = contacts.animal_id
          LEFT JOIN tags ON a.id = tags.animal_id
          LEFT JOIN colors ON a.id = colors.animal_id
          LEFT JOIN images ON a.id = images.animal_id
      WHERE a.type = ?
      AND contacts.zip = ?
    `,
    ];

    const bindings = [options.type, options.zip];

    const addFilterStatement = createDynamicQuery(queries, bindings);

    addFilterStatement(options.name, 'a.name');
    addFilterStatement(options.age, 'a.age');
    addFilterStatement(options.gender, 'a.gender');
    addFilterStatement(options.coatLength, 'a.coatLength');
    addFilterStatement(options.size, 'a.size');

    // handle good_with cases
    if (options.goodWith) {
      const prefix = 'good_with_';
      if (typeof options.goodWith === 'string') {
        const stm = `${prefix}${options.goodWith}`;
        queries.push(`AND a.${stm} = 1`);
      } else if (Array.isArray(options.goodWith)) {
        const gwarr = options.goodWith.map(x => `${prefix}${x}`);
        gwarr.forEach(x => queries.push(`AND a.${x} = 1`));
      }
    }

    // handle care & health cases
    if (options.care) {
      if (typeof options.care === 'string') {
        const stm = _.snakeCase(options.care);
        queries.push(`AND a.${stm} = 1`);
      } else if (Array.isArray(options.care)) {
        const arr = options.care.map(x => _.snakeCase(x));
        arr.forEach(x => queries.push(`AND a.${x} = 1`));
      }
    }

    // handle breeds
    if (options.breed) {
      if (typeof options.breed === 'string') {
        queries.push(`AND (a.primaryBreed = ? OR a.secondaryBreed = ?)`);
        bindings.push(options.breed, options.breed);
      } else if (Array.isArray(options.breed)) {
        const [first, ...rest] = options.breed;
        queries.push(`AND (a.primaryBreed = ? OR a.secondaryBreed = ?)`);
        bindings.push(first, first);
        rest.forEach(x => {
          const v = _.lowerCase(x);
          queries.push(`OR (a.primaryBreed = ? OR a.secondaryBreed = ?)`);
          bindings.push(v, v);
        });
      }
    }

    // handle days on petfinder
    if (options.days) {
      queries.push(`AND DATE(a.created_at) <= DATE('now', '-${options.days} day')`);
    }

    queries.push('GROUP BY a.id');

    // handle colors aggregate having case
    if (options.color) {
      if (typeof options.color === 'string') {
        queries.push('HAVING colors LIKE ?');
        bindings.push(`%${options.color}%`);
      } else if (Array.isArray(options.color)) {
        const [first, ...rest] = options.color;
        queries.push('HAVING colors LIKE ?');
        bindings.push(`%${first}%`);
        rest.forEach(x => {
          queries.push('OR colors LIKE ?');
          bindings.push(`%${x}%`);
        });
      }
    }

    return knex.raw(queries.join(' '), bindings);
  },
};
