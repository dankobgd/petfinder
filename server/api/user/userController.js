const createError = require('http-errors');
const UserService = require('./userService');
const { User } = require('../../models');

// Update user avatar image
exports.updateAvatar = async (req, res, next) => {
  const userId = req.user.sub;

  try {
    const imageData = await UserService.uploadUserAvatar(req.file);
    await User.update(userId, { avatar: imageData.secure_url });
    return res.status(200).json({ message: 'Avatar has been uploaded successfully', url: imageData.secure_url });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
};

// Delete user avatar image
exports.deleteAvatar = async (req, res, next) => {
  const userId = req.user.sub;
  const { avatarUrl } = req.body;

  const publicId = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1, avatarUrl.lastIndexOf('.'));

  try {
    await User.update(userId, { avatar: null });
    await UserService.deleteUserAvatar(publicId);
    return res.status(200).json({ message: 'Avatar has been deleted successfully' });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
};

// Update user account details
exports.updateAccount = async (req, res, next) => {
  const userId = req.user.sub;
  const { username, email } = req.body;

  try {
    await User.update(userId, { username, email });
    return res.status(200).json({ message: 'Account has been updated successfully' });
  } catch (err) {
    return next(createError.BadRequest(err.message));
  }
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
