const router = require('express').Router();
const authRouter = require('./auth/authRoutes');
const userRoutes = require('./user/userRoutes');
const animalsRoutes = require('./animals/animalsRoutes');

module.exports = function apiRoutes() {
  router.use('/auth', authRouter);
  router.use('/user', userRoutes);
  router.use('/animals', animalsRoutes);

  return router;
};
