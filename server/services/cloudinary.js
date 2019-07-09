const cloudinary = require('cloudinary').v2;
const config = require('../config');

exports.initCloudinaryConfig = () =>
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

exports.cloudinaryUpload = (buffer, uploadOptions = {}) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(uploadOptions, (err, imageData) => {
        if (err) {
          return reject(err);
        }

        resolve(imageData);
      })
      .end(buffer);
  });
