const express = require('express');

const router = express.Router();

const {
  getAllMovies,
  getMovieByID,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movies.controller');

router.get('/', getAllMovies);

router.get('/:id', getMovieByID);

router.post('/', createMovie);

router.patch('/:id', updateMovie);

router.delete('/:id', deleteMovie);

module.exports = { moviesRouter: router };
