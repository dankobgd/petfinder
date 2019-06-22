const router = require('express').Router();
const authRouter = require('./auth/authRoutes');

module.exports = function apiRoutes() {
  router.use('/auth', authRouter);

  return router;
};
