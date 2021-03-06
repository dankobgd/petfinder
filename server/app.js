const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes');
const { initCloudinaryConfig } = require('./services/cloudinary');
const mw = require('./middleware');

require('./utils/express-async-errors.js');

const app = express();

initCloudinaryConfig();
mw.requestLogger(app);

app.use(
  cors({
    exposedHeaders: ['x-total-count'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes());

mw.errorHandler(app);

module.exports = app;
