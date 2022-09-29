const express = require('express')

const router = express.Router()

// Utils
const { upload } = require('../util/multer')

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
  deleteMovie,
  createReview
} = require('../controllers/movies.controller')

// ===================================================================================

router.use(validateSession)

// ===================================================================================

router.get('/', getAllMovies)

// ===================================================================================

router.get('/:id', getMovieByID)

// ===================================================================================

router.post(
  '/',
  isAdmin(['admin']),
  upload.single('imgurl'),
  createMovie
)

router.post('/:id/review', createReview)

// ===================================================================================

router.patch('/:id', isAdmin(['admin']), updateMovie)

// ===================================================================================

router.delete('/:id', isAdmin(['admin']), deleteMovie)

module.exports = { moviesRouter: router }
