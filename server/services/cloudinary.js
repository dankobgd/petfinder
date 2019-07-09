const cloudinary = require('cloudinary').v2;
const config = require('../config');

exports.initCloudinaryConfig = () =>
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

exports.uploadFile = (file, options = {}) =>
  new Promise((resolve, reject) => {
    const nameWithoutExt = file.filename.replace(/\.[^/.]+$/, '');

    const defaults = {
      public_id: nameWithoutExt,
    };

    const mergedOptions = {
      ...defaults,
      ...options,
    };

    cloudinary.uploader.upload(file.path, mergedOptions, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result);
    });
  });
