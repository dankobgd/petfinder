const router = require('express').Router();
const AnimalsController = require('./animalsController');
const mw = require('../../middleware');

const { requireJWT, condAuth } = mw.authGard;

router.get('/', condAuth, AnimalsController.getAnimals);
router.post('/', requireJWT, mw.uploadFile.upload().any(), AnimalsController.createAnimal);
router.put('/:id', requireJWT, AnimalsController.updateAnimal);
router.delete('/:id', requireJWT, AnimalsController.deleteAnimal);
router.get('/latest', condAuth, AnimalsController.getLatestAnimals);

router.post('/:id/like', requireJWT, AnimalsController.likeAnimal);
router.delete('/:id/unlike', requireJWT, AnimalsController.unlikeAnimal);
router.post('/:id/adopt', requireJWT, AnimalsController.adoptAnimal);

router.post('/countrycode', AnimalsController.getCountryCode);

module.exports = router;
