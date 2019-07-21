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
  try {
    const userId = req.user.sub;
    const fileUploadPromises = req.files.map(file => AnimalService.uploadPetImage(file));
    const imageData = await Promise.all(fileUploadPromises);

    const results = await AnimalService.getCoordsFromAddress(req.body.address.trim());

    const data = {
      ...req.body,
      user_id: userId,
      imageUrl: imageData[0].secure_url,
      lat: results[0].lat,
      lng: results[0].lon,
    };

    await AnimalService.createPet(data);
    res.json(data);
  } catch (err) {
    console.error(err);
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
