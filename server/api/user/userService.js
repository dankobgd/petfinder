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
          (CASE WHEN a.user_id = users.id and a.user_id = 1 THEN true END) as mine,
          liked,
          a.*,
          contacts.phone,
          contacts.email,
          contacts.country,
          contacts.city,
          contacts.address,
          contacts.lat,
          contacts.lng,
          microchip.number AS chip_id,
					microchip.brand AS chip_brand,
					microchip.description AS chip_description,
					microchip.location AS chip_location,
          COALESCE(JSON_AGG(DISTINCT tags.text) FILTER (WHERE tags.animal_id IS NOT NULL), NULL) AS tags,
          COALESCE(JSON_AGG(DISTINCT images.url) FILTER (WHERE images.animal_id IS NOT NULL), NULL) AS images,
          COALESCE(JSON_AGG(DISTINCT colors.color) FILTER (WHERE colors.animal_id IS NOT NULL), NULL) AS colors
      FROM animals as a
          LEFT JOIN contacts ON a.id = contacts.animal_id
          LEFT JOIN tags ON a.id = tags.animal_id
          LEFT JOIN colors ON a.id = colors.animal_id
          LEFT JOIN images ON a.id = images.animal_id
          LEFT JOIN users on a.user_id = users.id
          LEFT JOIN microchip on a.id = microchip.animal_id
          LEFT JOIN LATERAL (SELECT true AS liked FROM likes WHERE a.id = likes.animal_id AND likes.user_id = ?) liked ON true
      WHERE a.user_id = ?
      GROUP BY a.id, contacts.id, liked, microchip.id, users.id
      ORDER BY a.created_at DESC
    `,
      [userId, userId]
    );
  },

  async getLikedPets(userId) {
    return knex.raw(
      `
      SELECT
          (CASE WHEN a.user_id = users.id and a.user_id = 1 THEN true END) as mine,  
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
          LEFT JOIN microchip on a.id = microchip.animal_id
          LEFT JOIN users on a.user_id = users.id
          LEFT JOIN LATERAL (SELECT true AS liked FROM likes WHERE a.id = likes.animal_id AND likes.user_id = ?) liked ON true
      WHERE likes.user_id = ? AND a.id = likes.animal_id
      GROUP BY a.id, contacts.id, liked, users.id
      ORDER BY a.liked_at DESC
    `,
      [userId, userId]
    );
  },

  async getAdoptedPets(userId) {
    return knex.raw(
      `
      SELECT
          (CASE WHEN a.user_id = users.id and a.user_id = 1 THEN true END) as mine,
          liked,
          a.*,
          contacts.phone,
          contacts.email,
          contacts.country,
          contacts.city,
          contacts.address,
          contacts.lat,
          contacts.lng,
          microchip.number AS chip_id,
					microchip.brand AS chip_brand,
					microchip.description AS chip_description,
					microchip.location AS chip_location,
          COALESCE(JSON_AGG(DISTINCT tags.text) FILTER (WHERE tags.animal_id IS NOT NULL), NULL) AS tags,
          COALESCE(JSON_AGG(DISTINCT images.url) FILTER (WHERE images.animal_id IS NOT NULL), NULL) AS images,
          COALESCE(JSON_AGG(DISTINCT colors.color) FILTER (WHERE colors.animal_id IS NOT NULL), NULL) AS colors
      FROM animals as a
          LEFT JOIN contacts ON a.id = contacts.animal_id
          LEFT JOIN tags ON a.id = tags.animal_id
          LEFT JOIN colors ON a.id = colors.animal_id
          LEFT JOIN images ON a.id = images.animal_id
          LEFT JOIN likes ON a.id = likes.animal_id
          LEFT JOIN adopted ON a.id = adopted.animal_id
          LEFT JOIN users on a.user_id = users.id
          LEFT JOIN microchip on a.id = microchip.animal_id
          LEFT JOIN LATERAL (SELECT true AS liked FROM likes WHERE a.id = likes.animal_id AND likes.user_id = ?) liked ON true
      WHERE a.adopted = true AND adopted.user_id = ?
      GROUP BY a.id, contacts.id, liked, microchip.id, users.id
      ORDER BY a.adopted_at DESC
      `,
      [userId, userId]
    );
  },
};
