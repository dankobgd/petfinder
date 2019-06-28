const router = require('express').Router();
const authRouter = require('./auth/authRoutes');
const animalsRoutes = require('./animals/animalsRoutes');

module.exports = function apiRoutes() {
  router.use('/auth', authRouter);
  router.use('/animals', animalsRoutes);

  return router;
};
