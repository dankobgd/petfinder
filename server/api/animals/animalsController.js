const createError = require('http-errors');
const AnimalService = require('./animalsService');

// Return country short code
exports.getCountryCode = async (req, res, next) => {
  const countrycode = await AnimalService.getCountryShortCode(req.body.loc);
  res.status(200).json(countrycode);
};

// Get latest animals
exports.getLatestAnimals = async (req, res, next) => {
  const userId = req.user && req.user.sub;
  try {
    const latest = await AnimalService.getLatestAnimals(userId);
    res.status(200).json({ animals: latest.rows });
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
};

// Get animals
exports.getAnimals = async (req, res, next) => {
  const userId = req.user && req.user.sub;
  try {
    const { results, pagination } = await AnimalService.getSearchFilterResults(req.query, userId);
    const searchResults = results.rows.map(({ total, ...rest }) => rest);
    res.status(200).json({ meta: pagination, animals: searchResults });
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
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
    const profileImage = req.files.find(file => file.fieldname === 'profileImage');
    const galleryImages = req.files.filter(file => file.fieldname === 'galleryImages');

    const profileImageData = await AnimalService.uploadPetImage(profileImage);
    const galleryImagesPromises = galleryImages.map(file => AnimalService.uploadPetImage(file));
    const galleryImagesData = await Promise.all(galleryImagesPromises);
    const galleryURIs = galleryImagesData.map(x => x.secure_url);

    const results = await AnimalService.getCoordsFromAddress(req.body.address.trim());

    const extractZip = address =>
      address
        .split(',')
        .reverse()[1]
        .trim();

    const data = {
      ...req.body,
      userId: req.user.sub,
      imageUrl: profileImageData.secure_url,
      gallery: galleryURIs,
      lat: results[0].lat,
      lng: results[0].lon,
      zip: extractZip(results[0].display_name),
    };

    const petData = await AnimalService.createPet(data);
    res.status(201).json({ petData });
  } catch (err) {
    console.error(err);
  }
};

// Like pet
exports.likeAnimal = async (req, res, next) => {
  const animalId = Number.parseInt(req.params.id, 10);
  const userId = req.user.sub;
  try {
    const result = await AnimalService.likeAnimal(userId, animalId);
    res.status(200).json(result);
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
};

// Unlike pet
exports.unlikeAnimal = async (req, res, next) => {
  const animalId = Number.parseInt(req.params.id, 10);
  const userId = req.user.sub;
  try {
    const result = await AnimalService.unlikeAnimal(userId, animalId);
    res.status(200).json(result);
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
};

// Adopt pet
exports.adoptAnimal = async (req, res, next) => {
  const animalId = Number.parseInt(req.params.id, 10);
  const userId = req.user.sub;
  try {
    const result = await AnimalService.adoptAnimal(userId, animalId);
    res.status(200).json(result);
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
};

// Update pet
exports.updateAnimal = async (req, res, next) => {
  const animalId = Number.parseInt(req.params.id, 10);
  try {
    const result = await AnimalService.updateAnimal(animalId, req.body.petData);
    res.status(200).json(result);
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
};

// Delete pet
exports.deleteAnimal = async (req, res, next) => {
  const animalId = Number.parseInt(req.params.id, 10);
  try {
    const result = await AnimalService.deleteAnimal(animalId);
    res.status(200).json(result);
  } catch (err) {
    next(createError.BadRequest(err.message));
  }
};
