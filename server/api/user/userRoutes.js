const router = require('express').Router();
const UserController = require('./userController');
const mw = require('../../middleware');
const { accountSchema, passwordSchema } = require('./validations');

const fileUpload = mw.uploadFile.upload().single('avatar');
const { requireJWT } = mw.authGard;

router.post('/edit-avatar', requireJWT, fileUpload, UserController.updateAvatar);
router.delete('/delete-avatar', requireJWT, UserController.deleteAvatar);
router.post('/edit-account', requireJWT, mw.validate(accountSchema), UserController.updateAccount);
router.post('/change-password', requireJWT, mw.validate(passwordSchema), UserController.changePassword);
router.get('/pets', requireJWT, UserController.getUsersPets);
router.get('/pets/liked', requireJWT, UserController.getLikedPets);
router.get('/pets/adopted', requireJWT, UserController.getAdoptedPets);
router.post('/pets/contact', UserController.sendContactEmail);

module.exports = router;
