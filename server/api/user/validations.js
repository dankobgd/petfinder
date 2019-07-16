const Joi = require('@hapi/joi');

const accountSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required(),
    avatar: Joi.string().required(),
  }),
};

const passwordSchema = {
  body: Joi.object().keys({
    oldPassword: Joi.string()
      .min(3)
      .max(25)
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

module.exports = {
  accountSchema,
  passwordSchema,
};
