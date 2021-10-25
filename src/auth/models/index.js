'use strict';

const userModel = require('./users.js');
const holidayModel = require('../../api/models/holidays/model');
const movieModel = require('../../api/models/movies/model');
const Collection = require('../../api/models/data-collection');
const { Sequelize, DataTypes } = require('sequelize');

// const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';
const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const holiday = holidayModel(sequelize, DataTypes);
const movie = movieModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
  holiday: new Collection(holiday),
  movie: new Collection(movie),
}
