const createError = require('http-errors');
const AnimalService = require('./animalsService');
const { Animal } = require('../../models');

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
  console.log(req.body);
  res.status(200).json({ animals: req.body });
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
