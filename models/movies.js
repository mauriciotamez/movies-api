'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.actor, {
        through: models.actor_movie_junction
      })
    }
  }
  movie.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      imgurl: DataTypes.STRING,
      genre: DataTypes.STRING,
      status: DataTypes.STRING,
      year: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'movie',
      freezeTableName: true
    }
  )
  return movie
}
