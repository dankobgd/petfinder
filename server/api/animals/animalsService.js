const request = require('request');
const intersection = require('lodash/intersection');
const { cloudinaryUpload } = require('../../services/cloudinary');
const config = require('../../config');
const knex = require('../../db/connection');

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

    intersection(target, provided).forEach(item => {
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
};
