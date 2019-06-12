const router = require('express').Router();
const userRouter = require('./user/userRoutes');
const authRouter = require('./auth/authRoutes');

module.exports = function apiRoutes() {
  router.use('/user', userRouter);
  router.use('/auth', authRouter);

  return router;
};
