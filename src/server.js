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


// Morty eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1vcnR5IiwiaWF0IjoxNjM1MDMwMTAzfQ.3b8UfAC4rIOVQDpbOr3N6MqjSSdR5u7sqxzcvKwlu6U
// Rick eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJpY2siLCJpYXQiOjE2MzUwMzAxNTl9.KJiL2-n_td-LhvdPxR0XYmKoFaRYiYCbYdYCThCzZiw
// Zorp eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlpvcnAiLCJpYXQiOjE2MzUwMzAxODR9.3fqI7-CYp4NiqTQjhHi14dEMinDe2FUJKFeD5KXPSM0
// Doc eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRvYyIsImlhdCI6MTYzNTAzMDIwNX0.3aGkwtUkp3aa9e7ksLhzJaKaBv4hWwUFJPmIOYdgll8
