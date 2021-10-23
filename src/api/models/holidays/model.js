'use strict';

const holidayModel = (sequelize, DataTypes) => sequelize.define('Holiday', {
  name: { type: DataTypes.STRING, required: true },
  reason: { type: DataTypes.STRING, required: true }
});

module.exports = holidayModel;
