const googleMaps = require('@google/maps');
const { uploadFile } = require('../../services/cloudinary');
const config = require('../../config');

const googleMapsClient = googleMaps.createClient({
  key: config.geocodingApiKey,
  Promise,
});

module.exports = {
  async uploadPetImage(file) {
    const opts = {
      folder: 'petfinder/pet_images',
    };
    return uploadFile(file, opts);
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
