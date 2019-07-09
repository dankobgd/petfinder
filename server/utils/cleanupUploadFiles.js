const { promises: fs } = require('fs');

exports.cleanupUploadFiles = async paths => {
  const task = await paths.map(p => fs.unlink(p));
  return Promise.all(task);
};
