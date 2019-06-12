const UserService = require('./userService');

exports.info = async (req, res, next) => {
  const user = await UserService.getOne(req.user.sub);
  res.json(UserService.toAuthJSON(user));
};
