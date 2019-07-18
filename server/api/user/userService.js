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
};
