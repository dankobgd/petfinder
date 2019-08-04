const createError = require('http-errors');
const AnimalService = require('./animalsService');

// Get animals
exports.getAnimals = async (req, res, next) => {
  const filteredResults = await AnimalService.getSearchFilterResults(req.query);
  console.log(filteredResults);
  res.status(200).json({ animals: filteredResults });
};

// Get animal
exports.getAnimal = async (req, res, next) => {
  const { id } = req.params;
  const animal = await AnimalService.getSingleAnimal(id);
  res.status(200).json({ animal });
};

// Create animal
exports.createAnimal = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const profileImage = req.files.find(file => file.fieldname === 'profileImage');
    const galleryImages = req.files.filter(file => file.fieldname === 'galleryImages');

    const profileImageData = await AnimalService.uploadPetImage(profileImage);
    const galleryImagesPromises = galleryImages.map(file => AnimalService.uploadPetImage(file));
    const galleryImagesData = await Promise.all(galleryImagesPromises);
    const galleryURIs = galleryImagesData.map(x => x.secure_url);

    const results = await AnimalService.getCoordsFromAddress(req.body.address.trim());

    const data = {
      ...req.body,
      user_id: userId,
      imageUrl: profileImageData.secure_url,
      lat: results[0].lat,
      lng: results[0].lon,
      gallery: galleryURIs,
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
