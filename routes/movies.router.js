const express = require('express')

const router = express.Router()

// Middlewares
const {
  isAdmin,
  validateSession
} = require('../middlewares/auth.middleware')

// Controllers
const {
  getAllMovies,
  getMovieByID,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movies.controller')

router.use(validateSession)

router.get('/', getAllMovies)

router.get('/:id', getMovieByID)

router.post('/', isAdmin(['admin']), createMovie)

router.patch('/:id', isAdmin(['admin']), updateMovie)

router.delete('/:id', isAdmin(['admin']), deleteMovie)

module.exports = { moviesRouter: router }
