const mw = require('../../middleware');
const { signupSchema, loginSchema } = require('./validations');

exports.signup = (req, res, next) => res.json(req.body);

exports.login = (req, res, next) => res.json(req.body);
