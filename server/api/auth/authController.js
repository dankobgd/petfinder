const createError = require('http-errors');
const AuthService = require('./authService');

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await AuthService.getOne(email);

  if (user) {
    return next(createError(403, 'Email is already taken'));
  }

  const newUser = await AuthService.createUser({
    username,
    email,
    password,
  });

  const token = AuthService.signJWT(newUser);
  res.status(200).json({ jwt: token });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await AuthService.getOne(email);

  if (!user) {
    return next(createError(404, 'User does not exist'));
  }

  if (!AuthService.comparePassword(password, user.password)) {
    return next(createError(400, 'Invalid credentials'));
  }

  const token = AuthService.signJWT(user);
  res.status(200).json({ jwt: token });
};
