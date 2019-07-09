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
  const fileUploadPromises = req.files.map(file => AnimalService.uploadPetImage(file));
  const imageData = await Promise.all(fileUploadPromises);

  try {
    const results = await AnimalService.getCoordsFromAddress(req.body.address.trim());
    const { lat, lng } = results[0].geometry.location;
    res.json({ body: req.body, imageData, location: { lat, lng } });
  } catch (err) {
    console.log(err);
  }
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
