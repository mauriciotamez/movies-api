'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.movie, {
        through: models.actor_movie_junction
      })
    }
  }
  actor.init(
    {
      name: DataTypes.STRING,
      country: DataTypes.STRING,
      age: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      profile_pic: DataTypes.STRING,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'actor',
      freezeTableName: true
    }
  )
  return actor
}
