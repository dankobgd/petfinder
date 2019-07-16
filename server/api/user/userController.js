const createError = require('http-errors');
const { User } = require('../../models');

// Update user account details
exports.updateAccount = async (req, res, next) => {
  console.log(req.file);
};

// Change user password
exports.changePassword = async (req, res, next) => {
  const { oldPassword, password } = req.body;

  try {
    await User.verifyOldPassword(req.user.sub, oldPassword);
    await User.updatePassword(req.user.sub, { password });
    res.status(200).json({ message: 'Password has been changed successfully' });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
};
