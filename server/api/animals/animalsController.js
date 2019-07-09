const createError = require('http-errors');
const AnimalService = require('./animalsService');
const { Animal } = require('../../models');
const { cleanupUploadFiles } = require('../../utils/cleanupUploadFiles');

// Get all animals
exports.getAnimals = async (req, res, next) => {
  res.status(200).json({ animals: 'ALL_ANIMALS' });
};

// Get animal
exports.getAnimal = async (req, res, next) => {
  res.status(200).json({ animals: 'ANIMAL' });
};

// Create animal
exports.createAnimal = async (req, res, next) => {
  const imagePromises = req.files.map(file => AnimalService.uploadPetImage(file));
  const imagesData = await Promise.all(imagePromises);
  res.status(200).json(imagesData);

  try {
    const results = await AnimalService.getCoordsFromAddress(req.body.address);
    const { lat, lng } = results[0].geometry.location;
    res.json({ lat, lng });
  } catch (err) {
    console.log(err);
  }

  const imgPaths = req.files.map(file => file.path);
  await cleanupUploadFiles(imgPaths);
};

// Update animal
exports.updateAnimal = async (req, res, next) => {
  res.status(200).json({ animals: 'UPDATE' });
};

// Delete animal
exports.deleteAnimal = async (req, res, next) => {
  res.status(200).json({ animals: 'DELETE' });
};

// Get all types
exports.getTypes = async (req, res, next) => {
  res.status(200).json({ animals: 'ALL_TYPES' });
};

// Get type
exports.getType = async (req, res, next) => {
  res.status(200).json({ animals: 'TYPE' });
};
