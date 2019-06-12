const router = require('express').Router();
const UserController = require('./userController');
const mw = require('../../middleware');

const { requireJWT } = mw.authGard;

router.get('/', requireJWT, UserController.info);

module.exports = router;
