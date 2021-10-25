'use strict';

// MW
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importing Error Handlers
const errorHandler = require('./error-handlers/500');
const notFound = require('./error-handlers/404.js');
const logger = require('./middleware/logger');

// Importing routes
const authRoutes = require('./auth/authRoutes');
const v1Routes = require('./api/apiRoutes');

const app = express();

// App level MW
app.use(cors());
app.use(morgan('dev'));
app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use('/api/apiRoutes', v1Routes);

// Erroer Handlers
app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
