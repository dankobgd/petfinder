const router = require('express').Router();
const AuthController = require('./authController');
const mw = require('../../middleware');
const { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('./validations');

const { requireJWT } = mw.authGard;

router.post('/signup', mw.validate(signupSchema), AuthController.signup);
router.post('/login', mw.validate(loginSchema), AuthController.login);

router.get('/current-user', requireJWT, AuthController.getCurrentUser);

router.post('/password-forgot', mw.validate(forgotPasswordSchema), AuthController.passwordForgot);
router.post('/password-reset', mw.validate(resetPasswordSchema), AuthController.passwordReset);
router.post('/validate-reset-token', AuthController.validateResetToken);

module.exports = router;
