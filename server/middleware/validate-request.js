const Joi = require('joi');
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
      const source = src.length > 1 ? src : src[0];

      const keys = err.details.map(d => `${d.path[0]}.${d.context.key}`);

      const details = err.details.map(d => ({
        message: d.message.replace(/["]/gi, ''),
        type: d.type,
        context: d.context,
      }));

      return next(
        createError(422, 'Payload validation failed', {
          validation: {
            source,
            keys,
            details,
          },
        })
      );
    }

    const extendObject = {};
    extendObject.body = value;
    Object.assign(req, extendObject);
    next();
  };
}

function middleware(schema, options = defaultOptions) {
  return (req, res, next) => {
    if (!schema) {
      next(createError(500, 'No validation schema provided'));
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
