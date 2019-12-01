const router = require('express').Router();
const AnimalsController = require('./animalsController');
const mw = require('../../middleware');

const { requireJWT, condAuth } = mw.authGard;

router.get('/', condAuth, AnimalsController.getAnimals);
router.get('/latest', condAuth, AnimalsController.getLatestAnimals);
router.get('/:id', AnimalsController.getAnimal);
router.post('/create', requireJWT, mw.uploadFile.upload().any(), AnimalsController.createAnimal);
router.put('/update/:id', requireJWT, AnimalsController.updateAnimal);
router.delete('/delete/:id', requireJWT, AnimalsController.deleteAnimal);

router.post('/:id/like', requireJWT, AnimalsController.likeAnimal);
router.delete('/:id/unlike', requireJWT, AnimalsController.unlikeAnimal);

router.post('/:id/adopt', requireJWT, AnimalsController.adoptAnimal);

router.get('/types', AnimalsController.getTypes);
router.get('/types/:type', AnimalsController.getType);

router.post('/countrycode', AnimalsController.getCountryCode);

module.exports = router;
