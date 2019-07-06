const router = require('express').Router();
const AnimalsController = require('./animalsController');
const mw = require('../../middleware');

router.get('/', AnimalsController.getAnimals);
router.get('/:id', AnimalsController.getAnimal);
router.post('/create', mw.uploadFile.upload().any(), AnimalsController.createAnimal);
router.put('/update/:id', AnimalsController.updateAnimal);
router.delete('/delete/:id', AnimalsController.deleteAnimal);

router.get('/types', AnimalsController.getTypes);
router.get('/types/:type', AnimalsController.getType);

module.exports = router;
