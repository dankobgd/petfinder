const Joi = require('@hapi/joi');
const createError = require('http-errors');

const defaultOptions = {
  joiOptions: {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
  },
  validationCallback: null,
};

function validationCallback(req, res, next, options) {
  return (err, value) => {
    if (err) {
      const src = [...new Set(err.details.map(d => d.path[0]))];
      const keys = [...new Set(err.details.map(d => `${d.path[0]}.${d.context.key}`))];
      const source = src.length > 1 ? src : src[0];

      const details = err.details.map(d => ({
        message: d.message.replace(/["]/gi, ''),
        type: d.type,
        context: d.context,
      }));

      const validationError = createError.UnprocessableEntity('Payload validation error');
      const errInfo = { source, keys, details };
      validationError.name = err.name;
      validationError.validation = errInfo;
      return next(validationError);
    }

    const extendObject = {};
    extendObject.body = value.body;
    Object.assign(req, extendObject);
    next();
  };
}

function middleware(schema, options = defaultOptions) {
  return (req, res, next) => {
    if (!schema) {
      return next(createError.InternalServerError('No validation schema provided'));
    }

    const toValidate = {};
    const REQ_VALIDATIONS = ['params', 'body', 'query', 'headers'];

    REQ_VALIDATIONS.forEach(key => {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    const joiOptions = options.joiOptions || {};
    const cb = options.validationCallback || validationCallback;

    return Joi.validate(toValidate, schema, joiOptions, cb(req, res, next, options));
  };
}

module.exports = middleware;
