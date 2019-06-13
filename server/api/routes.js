const router = require('express').Router();
const userRouter = require('./user/userRoutes');
const authRouter = require('./auth/authRoutes');

module.exports = function apiRoutes() {
  router.use('/auth', authRouter);
  router.use('/user', userRouter);

  return router;
};
