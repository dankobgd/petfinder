const router = require('express').Router();
const UserController = require('./userController');
const mw = require('../../middleware');

const { requireJWT } = mw.authGard;

router.get('/current', requireJWT, UserController.getCurrentUser);

module.exports = router;
