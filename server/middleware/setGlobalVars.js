module.exports = (req, res, next) => {
  req.siteURL = `${req.protocol}://${req.headers.host}/api`;
  next();
};
