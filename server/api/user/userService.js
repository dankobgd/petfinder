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
      SELECT
          liked,
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
          LEFT JOIN LATERAL (SELECT true AS liked FROM likes WHERE a.id = likes.animal_id AND likes.user_id = ?) liked ON true
      WHERE user_id = ?
      GROUP BY a.id, contacts.id, liked
    `,
      [userId, userId]
    );
  },

  async getLikedPets(userId) {
    return knex.raw(
      `
      SELECT
          liked,
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
          LEFT JOIN likes ON a.id = likes.animal_id
          LEFT JOIN LATERAL (SELECT true AS liked FROM likes WHERE a.id = likes.animal_id AND likes.user_id = ?) liked ON true
      WHERE likes.user_id = ? AND a.id = likes.animal_id
      GROUP BY a.id, contacts.id, liked
    `,
      [userId, userId]
    );
  },
};
