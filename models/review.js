'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.movie), this.belongsTo(models.user)
    }
  }
  review.init(
    {
      title: DataTypes.STRING,
      comment: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      movie_id: DataTypes.INTEGER,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'review',
      freezeTableName: true
    }
  )
  return review
}
