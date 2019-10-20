const request = require('request');
const _ = require('lodash');
const { cloudinaryUpload } = require('../../services/cloudinary');
const config = require('../../config');
const knex = require('../../db/connection');

function lowerizeCase(obj) {
  const arr = Object.entries(obj).map(([k, v]) => {
    const exists = v !== undefined && v !== null && v !== 'undefined';

    if (exists) {
      if (typeof v === 'string') {
        return [k, v.toLowerCase()];
      }
      if (Array.isArray(v)) {
        const lowerVal = v.map(x => x.toLowerCase());
        return [k, lowerVal];
      }
      return [k, v];
    }

    return [k, null];
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

  async getCoordsFromZIP(zipCode, countryCode) {
    return new Promise((resolve, reject) => {
      const zip = encodeURIComponent(zipCode);
      const cc = encodeURIComponent(countryCode);

      const baseURI = `https://us1.locationiq.org/v1/search.php?key=${config.geocodingApiKey}&format=json&postalcode=${zip}`;
      const countryCodeQuery = `&countrycodes=${cc}`;
      const geocodeURI = !cc ? baseURI : baseURI + countryCodeQuery;

      request(geocodeURI, (error, response, body) => {
        if (error) return reject(error);
        resolve(JSON.parse(body));
      });
    });
  },

  async getCountryShortCode({ lat, lng }) {
    return new Promise((resolve, reject) => {
      const geocodeURI = `https://us1.locationiq.org/v1/reverse.php?key=${config.geocodingApiKey}&format=json&lat=${lat}&lon=${lng}`;
      request(geocodeURI, (error, response, body) => {
        if (error) return reject(error);
        const b = JSON.parse(body);
        resolve(b.address.country_code);
      });
    });
  },

  async createPet(obj) {
    // // const data = lowerizeCase(obj);
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

    const animalId = await knex('animals')
      .insert({
        user_id: data.userId,
        name: data.name,
        type: data.type,
        species: data.species,
        gender: data.gender,
        age: data.age,
        coat_length: data.coatLength,
        size: data.size,
        description: data.description,
        image_url: data.imageUrl,
        status: 'Adoptable',
        primary_breed: data.primaryBreed,
        secondary_breed: data.secondaryBreed,
        mixed_breed: Number(!!data.mixedBreed),
        unknown_breed: Number(!!data.unknownBreed),
        ...petAttributes,
      })
      .returning('id');

    await knex('contacts').insert({
      animal_id: animalId[0],
      phone: data.phone,
      email: data.email,
      country: data.country,
      city: data.city,
      address: data.address,
      zip: data.zip,
      lat: Number.parseFloat(data.lat),
      lng: Number.parseFloat(data.lng),
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
    // const options = lowerizeCase(payload);
    const options = payload;

    const geoData = await this.getCoordsFromZIP(options.zip, options.countryCode);
    const { lat, lon } = geoData[0];
    const parseCoordinate = coord => Number.parseFloat(coord);
    const getSearchDistance = d => Number.parseInt(d.substr(0, d.length - 2), 10);

    const searchLatitude = parseCoordinate(lat);
    const searchLongitude = parseCoordinate(lon);

    const queries = [
      `
      SELECT
          (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(contacts.lat))
            * COS(RADIANS(contacts.lng) - RADIANS(?))
            + SIN(RADIANS(?)) * SIN(RADIANS(contacts.lat)))
          ) as distance,
          a.*,
          contacts.phone,
          contacts.email,
          contacts.country,
          contacts.city,
          contacts.address,
          contacts.lat,
          contacts.lng,
          COALESCE(JSON_AGG(DISTINCT tags.text) FILTER (WHERE tags.animal_id IS NOT NULL), NULL) AS tags,
          COALESCE(JSON_AGG(DISTINCT images.url) FILTER (WHERE images.animal_id IS NOT NULL), NULL) AS images,
          COALESCE(JSON_AGG(DISTINCT colors.color) FILTER (WHERE colors.animal_id IS NOT NULL), NULL) AS colors
      FROM animals as a
          LEFT JOIN contacts ON a.id = contacts.animal_id
          LEFT JOIN tags ON a.id = tags.animal_id
          LEFT JOIN colors ON a.id = colors.animal_id
          LEFT JOIN images ON a.id = images.animal_id
      WHERE a.type = ?
    `,
    ];

    const bindings = [searchLatitude, searchLongitude, searchLatitude, options.type];

    const addFilterCondition = createDynamicQuery(queries, bindings);

    addFilterCondition(options.age, 'a.age');
    addFilterCondition(options.gender, 'a.gender');
    addFilterCondition(options.coat_length, 'a.coat_length');
    addFilterCondition(options.size, 'a.size');

    // Handle pet name fuzzy search
    if (options.name) {
      queries.push(`AND a.name ILIKE ?`);
      bindings.push(`%${options.name}%`);
    }

    // handle good_with cases
    if (options.goodWith) {
      const prefix = 'good_with_';
      if (typeof options.goodWith === 'string') {
        const stm = `${prefix}${options.goodWith}`;
        queries.push(`AND a.${stm} = true`);
      } else if (Array.isArray(options.goodWith)) {
        const gwarr = options.goodWith.map(x => `${prefix}${x}`);
        gwarr.forEach(x => queries.push(`AND a.${x} = true`));
      }
    }

    // handle care & health cases
    if (options.care) {
      if (typeof options.care === 'string') {
        const stm = _.snakeCase(options.care);
        queries.push(`AND a.${stm} = true`);
      } else if (Array.isArray(options.care)) {
        const arr = options.care.map(x => _.snakeCase(x));
        arr.forEach(x => queries.push(`AND a.${x} = true`));
      }
    }

    // handle breeds
    if (options.breed) {
      if (typeof options.breed === 'string') {
        queries.push(`AND (a.primary_breed = ? OR a.secondary_breed = ?)`);
        bindings.push(options.breed, options.breed);
      } else if (Array.isArray(options.breed)) {
        const [first, ...rest] = options.breed;
        queries.push(`AND (a.primary_breed = ? OR a.secondary_breed = ?)`);
        bindings.push(first, first);
        rest.forEach(x => {
          const v = _.lowerCase(x);
          queries.push(`OR (a.primary_breed = ? OR a.secondary_breed = ?)`);
          bindings.push(v, v);
        });
      }
    }

    // handle days on petfinder
    if (options.days) {
      queries.push(`AND a.created_at >= (NOW() - INTERVAL '${options.days} days' )`);
    }

    // GROUP BY CLAUSE
    queries.push('GROUP BY a.id, contacts.id');

    // AGGREGATE FUNCTIONS after GROUP BY...
    if (options.distance.toLowerCase() !== 'anywhere') {
      const searchDistance = getSearchDistance(options.distance);
      queries.push(`HAVING (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(contacts.lat))
                      * COS(RADIANS(contacts.lng) - RADIANS(?))
                      + SIN(RADIANS(?)) * SIN(RADIANS(contacts.lat)))) < ?`);

      bindings.push(searchLatitude, searchLongitude, searchLatitude, searchDistance);
    }

    // handle colors aggregate having case
    if (options.color) {
      if (typeof options.color === 'string') {
        queries.push('AND colors LIKE ?');
        bindings.push(`%${options.color}%`);
      } else if (Array.isArray(options.color)) {
        const [first, ...rest] = options.color;
        queries.push('AND colors LIKE ?');
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
