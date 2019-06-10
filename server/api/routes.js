const router = require('express').Router();
const homeRouter = require('./home/homeRoutes');
const authRouter = require('./auth/authRoutes');

module.exports = function apiRoutes() {
  router.use('/', homeRouter);
  router.use('/auth', authRouter);

  return router;
};
