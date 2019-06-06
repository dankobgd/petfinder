const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes');
const mw = require('./middleware');

require('./utils/express-async-errors.js');

const app = express();

mw.requestLogger(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
// app.get('*', (_, res) => res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html')));

app.use('/api', apiRoutes());

mw.errorHandler(app);

module.exports = app;
