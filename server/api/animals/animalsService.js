const googleMaps = require('@google/maps');
const { cloudinaryUpload } = require('../../services/cloudinary');
const config = require('../../config');

const googleMapsClient = googleMaps.createClient({
  key: config.geocodingApiKey,
  Promise,
});

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
    try {
      const response = await googleMapsClient.geocode({ address }).asPromise();
      return Promise.resolve(response.json.results);
    } catch (err) {
      Promise.reject(err);
    }
  },
};
