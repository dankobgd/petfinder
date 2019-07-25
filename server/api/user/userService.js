const knex = require('../../db/connection');
const { cloudinaryUpload, cloudinaryDelete } = require('../../services/cloudinary');

module.exports = {
  async uploadUserAvatar(file) {
    const { originalname, buffer } = file;

    // trim file extension
    const filename = originalname.replace(/\.[^/.]+$/, '');

    const cloudinaryOpts = {
      folder: 'petfinder/users',
      public_id: `${Date.now()}-${filename}`,
    };

    return cloudinaryUpload(buffer, cloudinaryOpts);
  },

  async deleteUserAvatar(publicId) {
    const fullPath = `petfinder/users/${publicId}`;
    return cloudinaryDelete(fullPath);
  },

  async getUsersPets(userId) {
    return knex.raw(
      `
      SELECT a.id, a.user_id, a.name, a.type, a.species, a.gender, a.age, a.coatLength,
             a.size, a.status, a.imageUrl, a.description, a.declawed, a.vaccinated,
             a.special_needs, a.house_trained, a.spayed_neutered, a.good_with_kids,
             a.good_with_cats, a.good_with_dogs, a.primaryBreed, a.secondaryBreed,
             a.mixedBreed, a.unknownBreed, a.created_at, a.updated_at, contacts.animal_id,
             contacts.phone, contacts.email, contacts.country, contacts.city,
             contacts.address, contacts.zip, contacts.lat, contacts.lng,
             GROUP_CONCAT(DISTINCT tags.text) AS tags,
             GROUP_CONCAT(DISTINCT images.url) AS images,
             GROUP_CONCAT(DISTINCT colors.color) AS colors
      FROM animals as a
             INNER JOIN contacts ON a.id = contacts.animal_id
             INNER JOIN tags ON a.id = tags.animal_id
             INNER JOIN colors ON a.id = colors.animal_id
             INNER JOIN images ON a.id = images.animal_id
      WHERE user_id = ?
      GROUP BY a.id
    `,
      [userId]
    );
  },
};
