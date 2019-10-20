const createError = require('http-errors');
const AuthService = require('./authService');
const { User, PasswordReset } = require('../../models');
const generateToken = require('../../utils/generateToken');
const config = require('../../config');

// User signup
exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(createError.Unauthorized('Email is already taken'));
    }
    const user = await User.create({ username, email, password });
    const accessToken = AuthService.signJWT(user);
    res.status(200).json({ accessToken, user });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
};

// User login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.verify(email, password);
    const accessToken = AuthService.signJWT(user);
    res.status(200).json({ accessToken, user });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
};

// Get current user data
exports.getCurrentUser = async (req, res, next) => {
  const currentUser = await User.findOne({ id: req.user.sub });
  res.json({ user: currentUser });
};

// Forgot password
exports.passwordForgot = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(createError.BadRequest('No user found with that email'));
  }

  const token = await generateToken();
  const resetPasswordURL = `http://localhost:3000/password-reset/${token}`;
  const expires = Date.now() + config.auth.resetPasswordValidFor;

  const emailCtx = {
    to: user.email,
    subject: 'reset password request',
    username: user.username,
    resetPasswordURL,
  };

  await AuthService.sendResetPasswordEmail(emailCtx);
  await PasswordReset.create({ user_id: user.id, token, expires });

  res.status(200).json({ message: 'Reset password email has been sent successfully' });
};

// Validate reset token
exports.validateResetToken = async (req, res, next) => {
  const { resetToken } = req.body;

  try {
    const tokenData = await PasswordReset.validateToken(resetToken);
    res.json(tokenData);
  } catch (err) {
    return next(createError.Unauthorized(err.message));
  }
};

// Reset password
exports.passwordReset = async (req, res, next) => {
  const { resetToken, password } = req.body;

  try {
    const tokenData = await PasswordReset.validateToken(resetToken);
    await PasswordReset.destroy(tokenData.id);
    const id = await User.updatePassword(tokenData.user_id, { password });
    const user = User.findOne({ id });

    const emailCtx = {
      to: user.email,
      subject: 'password changed',
      username: user.username,
    };

    await AuthService.sendPasswordChangedEmail(emailCtx);
    res.status(200).json({ message: 'Password has been changed successfully' });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
};
