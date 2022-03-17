// Models
const { Movie } = require('../models/movie.model');
const { Actor } = require('../models/actor.model');
const { User } = require('../models/user.model');
const { Review } = require('../models/review.model');
const {
  ActorsInMovies
} = require('../models/actorsInMovies');

const initModels = () => {
  Movie.belongsToMany(Actor, { through: ActorsInMovies });
  Actor.belongsToMany(Movie, { through: ActorsInMovies });

  Movie.hasMany(Review);
  Review.belongsTo(Movie);

  User.hasMany(Review);
  Review.belongsTo(User);
};

module.exports = { initModels };
