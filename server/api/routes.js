const router = require('express').Router();
const homeRouter = require('./home/homeRoutes');
const userRouter = require('./user/userRoutes');

module.exports = function apiRoutes() {
  router.use('/', homeRouter);
  router.use('/users', userRouter);

  return router;
};
