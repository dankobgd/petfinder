const { User } = require('../../models');

exports.getCurrentUser = async (req, res, next) => {
  const currentUser = await User.findOne({ id: req.user.sub });
  res.json({ user: currentUser });
};
