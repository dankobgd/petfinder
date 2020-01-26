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

// Get user's created pets (Adopted | Adoptable)
exports.getUsersPets = async (req, res, next) => {
  const userId = req.user.sub;

  try {
    const pets = await UserService.getUsersPets(userId);
    res.set('x-total-count', pets.rows.length);
    res.status(200).json({ pets: pets.rows });
  } catch (err) {
    return next(createError.BadRequest('Could not fetch pets'));
  }
};

// Get user's liked pets
exports.getLikedPets = async (req, res, next) => {
  const userId = req.user.sub;

  try {
    const pets = await UserService.getLikedPets(userId);
    res.set('x-total-count', pets.rows.length);
    res.status(200).json({ pets: pets.rows });
  } catch (err) {
    return next(createError.BadRequest('Could not fetch pets'));
  }
};

// Get user's adopted pets
exports.getAdoptedPets = async (req, res, next) => {
  const userId = req.user.sub;

  try {
    const pets = await UserService.getAdoptedPets(userId);
    res.set('x-total-count', pets.rows.length);
    res.status(200).json({ pets: pets.rows });
  } catch (err) {
    return next(createError.BadRequest('Could not fetch pets'));
  }
};

// Send pet contact email
exports.sendContactEmail = async (req, res, next) => {
  try {
    const emailCtx = {
      from: req.body.email,
      to: req.body.to,
      subject: 'Pet Contact',
      message: req.body.message,
    };
    await UserService.sendContactEmail(emailCtx);
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    return next(createError.BadRequest('Could not send contact email'));
  }
};
