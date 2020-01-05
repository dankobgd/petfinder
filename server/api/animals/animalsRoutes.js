const router = require('express').Router();
const AnimalsController = require('./animalsController');
const mw = require('../../middleware');

const { requireJWT, condAuth } = mw.authGard;

router.get('/latest', condAuth, AnimalsController.getLatestAnimals);
router.get('/', condAuth, AnimalsController.getAnimals);
router.post('/', requireJWT, mw.uploadFile.upload().any(), AnimalsController.createAnimal);
router.get('/:id', condAuth, AnimalsController.getAnimal);
router.put('/:id', requireJWT, AnimalsController.updateAnimal);
router.put('/contact/:id', requireJWT, AnimalsController.updateAnimalContact);
router.delete('/:id', requireJWT, AnimalsController.deleteAnimal);

router.post('/:id/like', requireJWT, AnimalsController.likeAnimal);
router.delete('/:id/unlike', requireJWT, AnimalsController.unlikeAnimal);
router.post('/:id/adopt', requireJWT, AnimalsController.adoptAnimal);

router.post('/countrycode', AnimalsController.getCountryCode);

module.exports = router;
