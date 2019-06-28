const router = require('express').Router();
const AnimalsController = require('./animalsController');
const mw = require('../../middleware');
// const {} = require('./validations');

const { requireJWT } = mw.authGard;

router.get('/', AnimalsController.getAnimals);
router.get('/:animalID', AnimalsController.getAnimal);
router.post('/create', AnimalsController.createAnimal);
router.put('/update/:animalID', AnimalsController.updateAnimal);
router.delete('/delete/:animalID', AnimalsController.deleteAnimal);

router.get('/types', AnimalsController.getTypes);
router.get('/types/:type', AnimalsController.getType);

module.exports = router;
