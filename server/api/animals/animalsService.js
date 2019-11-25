const request = require('request');
const _ = require('lodash');
const { cloudinaryUpload } = require('../../services/cloudinary');
const config = require('../../config');
const knex = require('../../db/connection');

const buildDynamicFilter = (queriesArr, bindingsArr) => (column, value) => {
  if (value) {
    const arr = Array.isArray(value) ? value : [value];
    queriesArr.push(`AND ${column} = ANY (?)`);
    bindingsArr.push(arr);
  }
};

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
        if (error) {
          return reject(error);
        }
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

  async getAnimals() {
    return knex('animals');
  },

  async getSingleAnimal(id) {
    return knex('animals').where({ id });
  },

  async getSearchFilterResults(options) {
    try {
      const geoData = await this.getCoordsFromZIP(options.zip, options.countryCode);
      if (geoData.error && geoData.error === 'Unable to geocode') {
        throw new Error('Invalid zip code, unable to geocode');
      }
      const { lat, lon } = geoData[0];
      const parseCoordinate = coord => Number.parseFloat(coord);
      const getSearchDistance = d => Number.parseInt(d.substr(0, d.length - 2), 10);
      const searchLatitude = parseCoordinate(lat);
      const searchLongitude = parseCoordinate(lon);

      const queries = [
        `
        SELECT
        COUNT(*) OVER() as total,
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

      const applyFilter = buildDynamicFilter(queries, bindings);

      applyFilter('a.age', options.age);
      applyFilter('a.gender', options.gender);
      applyFilter('a.coat_length', options.coatLength);
      applyFilter('a.size', options.size);

      if (options.goodWith) {
        const value = Array.isArray(options.goodWith) ? options.goodWith : [options.goodWith];
        const arr = value.map(x => `good_with_${x.toLowerCase()}`);
        arr.forEach(x => queries.push(`AND a.${x} = true`));
      }

      if (options.care) {
        const value = Array.isArray(options.care) ? options.care : [options.care];
        const arr = value.map(x => _.snakeCase(x));
        arr.forEach(x => queries.push(`AND a.${x} = true`));
      }

      if (options.breed) {
        const value = Array.isArray(options.breed) ? options.breed : [options.breed];
        queries.push('AND a.primary_breed = ANY (?) OR a.secondary_breed = ANY (?)');
        bindings.push(value, value);
      }

      if (options.days) {
        queries.push(`AND a.created_at >= (NOW() - INTERVAL '${options.days} days' )`);
      }

      if (options.name) {
        queries.push(`AND a.name ILIKE ?`);
        bindings.push(`%${options.name}%`);
      }

      queries.push('GROUP BY a.id, contacts.id');

      const specifiedDistance = options.distance.toLowerCase() !== 'anywhere';
      if (specifiedDistance) {
        const searchDistance = getSearchDistance(options.distance);
        queries.push(
          `HAVING (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(contacts.lat)) * COS(RADIANS(contacts.lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(contacts.lat)))) < ?`
        );
        bindings.push(searchLatitude, searchLongitude, searchLatitude, searchDistance);
      }

      if (options.color) {
        const clausePrefix = specifiedDistance ? 'AND' : 'HAVING';
        const value = Array.isArray(options.color) ? options.color : [options.color];
        const fmt = value.map(elm => `'"${elm}"'`).join(', ');
        queries.push(`${clausePrefix} JSON_AGG(DISTINCT colors.color)::jsonb @> ANY (ARRAY [${fmt}]::jsonb[])`);
      }

      /**
       * Other solution: -> HAVING JSON_AGG(DISTINCT colors.color)::jsonb ?| ARRAY['Black', 'White', 'Other']
       * figure out how to escape `?|` operator because `?` is used as interpolation in node-pg and knex
       * or just create custom operator
       */

      /**
       * Pagination meta
       */

      const currentPage = Number.parseInt(options.page, 10) || 1;
      const limitPerPage = Number.parseInt(options.limit, 10) || 32;
      const skip = (currentPage - 1) * limitPerPage;

      queries.push('OFFSET ? LIMIT ?');
      bindings.push(skip, limitPerPage);
      const results = await knex.raw(queries.join(' '), bindings);

      let totalRecords = 0;
      let totalPages = 0;
      if (results.rows.length) {
        totalRecords = Number.parseInt(results.rows[0].total, 10);
        totalPages = Math.ceil(totalRecords / limitPerPage);
      }

      const pagination = {
        currentPage,
        limitPerPage,
        skip,
        totalPages,
        totalRecords,
      };

      return { results, pagination };
    } catch (err) {
      throw err;
    }
  },

  async getLatestAnimals() {
    return knex.raw(
      `
      SELECT
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
      GROUP BY a.id, contacts.id
      ORDER BY a.created_at DESC
      LIMIT 8
    `
    );
  },
};
