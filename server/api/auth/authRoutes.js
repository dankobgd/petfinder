const router = require('express').Router();
const AuthController = require('./authController');
const mw = require('../../middleware');
const { signupSchema, loginSchema } = require('./validations');

router.post('/signup', mw.validate(signupSchema), AuthController.signup);
router.post('/login', mw.validate(loginSchema), AuthController.login);

module.exports = router;
