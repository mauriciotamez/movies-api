'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class actor_movie_junction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  actor_movie_junction.init(
    {},
    {
      sequelize,
      modelName: 'actor_movie_junction',
      freezeTableName: true
    }
  )
  return actor_movie_junction
}
