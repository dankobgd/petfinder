const { uploadFile } = require('../../services/cloudinary');

module.exports = {
  async uploadPetImage(data) {
    const opts = {
      folder: 'petfinder/pet_images',
      tags: data.meta.tags,
    };
    return uploadFile(data.file, opts);
  },
};
