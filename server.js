const { app } = require('./app');

// Models
const { Actor } = require('./models/actor.model');
const {
  ActorsInMovies
} = require('./models/actorsInMovies');
const { Movie } = require('./models/movie.model');
const { Review } = require('./models/review.model');
const { User } = require('./models/user.model');

// Utils
const { sequelize } = require('./util/database');
const { initModels } = require('./util/initModels');

sequelize
  .authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

// Models relations
initModels();

// Actor.sync()
//   .then(() => console.log('database synced'))
//   .catch((err) => console.log(err));

sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
