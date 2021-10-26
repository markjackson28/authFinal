'use strict';

const movieModel = (sequelize, DataTypes) => sequelize.define('Movie', {
  name: { type: DataTypes.STRING, required: true },
  rating: { type: DataTypes.INTEGER, required: true },
  reason: { type: DataTypes.STRING, required: true }
});

module.exports = movieModel;
