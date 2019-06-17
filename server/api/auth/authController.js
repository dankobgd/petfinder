const createError = require('http-errors');
const AuthService = require('./authService');
const { User } = require('../../models');

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(createError.Unauthorized('Email is already taken'));
  }
  const user = await User.create({ username, email, password });
  const accessToken = AuthService.signJWT(user);
  res.status(200).json({ accessToken, user });
};

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
