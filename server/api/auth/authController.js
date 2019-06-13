const createError = require('http-errors');
const AuthService = require('./authService');
const { User } = require('../../models');

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return next(createError(403, 'Email is already taken'));
  }

  const newUser = await User.create({ username, email, password });
  const token = AuthService.signJWT(newUser);
  res.status(200).json({ jwt: token });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.verify(email, password);
    const token = AuthService.signJWT(user);
    res.status(200).json({ jwt: token });
  } catch (err) {
    return next(createError(400, err));
  }
};
