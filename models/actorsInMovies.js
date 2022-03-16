const { DataTypes } = require('sequelize');

const { sequelize } = require('../util/database');

const ActorsInMovies = sequelize.define('actorsInMovies', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },
  actorId: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  movieId: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
});

module.exports = { ActorsInMovies };
