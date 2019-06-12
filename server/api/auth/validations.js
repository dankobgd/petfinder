const Joi = require('@hapi/joi');

const signupSchema = {
  body: Joi.object().keys({
    username: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(3)
      .max(25)
      .required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required(),
  }),
};

const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(3)
      .max(50)
      .required(),
  }),
};

module.exports = {
  signupSchema,
  loginSchema,
};
