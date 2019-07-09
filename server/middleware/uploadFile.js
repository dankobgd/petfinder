const multer = require('multer');
const config = require('../config');

module.exports.upload = () => {
  const storage = multer.memoryStorage();

  const limits = {
    fileSize: config.file.uploadLimit,
  };

  function fileFilter(req, file, cb) {
    const { allowedMimeTypes } = config.file;
    const validMimeType = allowedMimeTypes.test(file.mimetype);

    if (!validMimeType) {
      const formats = allowedMimeTypes
        .replace(/[/\\]/g, '')
        .split('|')
        .join(', ')
        .toUpperCase();
      const err = new Error(`Invalid file type. Allowed file formats are: ${formats}`);
      return cb(err, false);
    }

    cb(null, true);
  }

  return multer({ storage, limits, fileFilter });
};
