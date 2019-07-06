const path = require('path');
const multer = require('multer');
const config = require('../config');

module.exports.upload = () => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `${path.join(__dirname, '../uploads')}`);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  function fileFilter(req, file, cb) {
    const validMimeType = config.file.allowedMimeTypes.test(file.mimetype);

    if (!validMimeType) {
      const err = new Error('File type not allowed. Allowed formats: JPG, JPEG, PNG, BMP and GIF');
      return cb(err, false);
    }

    cb(null, true);
  }

  const limits = {
    fileSize: config.file.uploadLimit,
  };

  return multer({ storage, limits, fileFilter });
};
