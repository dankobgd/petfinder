const { User } = require('../../models');

exports.info = async (req, res, next) => {
  const user = await User.findById(req.user.sub);
  res.json(user);
};
