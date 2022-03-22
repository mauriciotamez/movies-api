// Utils
const { filterObj } = require('../util/filterObj');
const { handleError } = require('../util/handleError');
const { AppError } = require('../util/appError');

// Models
const { Movie } = require('../models/movie.model');

exports.getAllMovies = handleError(
  async (req, res, next) => {
    const movies = await Movie.findAll({
      where: { status: 'active' }
    });

    res.status(200).json({
      status: 'success',
      data: { movies }
    });
  }
);

exports.getMovieByID = handleError(
  async (req, res, next) => {
    const { id } = req.params;

    const movie = await Movie.findOne({
      where: { status: 'active', id }
    });

    if (!movie) {
      return next(
        new AppError(404, 'Cannot find movie, invalid ID')
      );
    }

    res.status(200).json({
      status: 'success',
      data: { movie }
    });
  }
);

exports.createMovie = handleError(
  async (req, res, next) => {
    const { title, description, duration, genre } =
      req.body;

    if (!title || !description || !duration || !genre) {
      return next(
        new AppError(
          404,
          'Need to provide a title, description, duration and genre'
        )
      );
    }

    const movie = await Movie.create({
      title,
      description,
      duration,
      genre
    });

    res.status(201).json({
      status: 'success',
      data: { movie }
    });
  }
);

exports.updateMovie = handleError(
  async (req, res, next) => {
    const { id } = req.params;

    const data = filterObj(
      req.body,
      'title',
      'description',
      'duration',
      'genre'
    );

    const movie = await Movie.findOne({
      where: { id, status: 'active' }
    });

    if (!movie) {
      return next(400, 'Cannot update movie, invalid ID');
    }

    await movie.update({ ...data });

    res
      .status(204)
      .json({ status: 'success', data: { movie } });
  }
);

exports.deleteMovie = handleError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      res.status(404).json({
        status: 'error',
        message: 'Cannot delete movie, invalid ID'
      });
      return;
    }

    const movie = await Movie.findOne({
      where: { status: 'active', id }
    });

    await movie.update({ status: 'deleted' });

    res.status(200).json({
      status: 'success'
    });
  }
);
