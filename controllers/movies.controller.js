const {
  ref,
  uploadBytes,
  getDownloadURL
} = require('firebase/storage')

// Utils
const { filterObj } = require('../util/filterObj')
const { handleError } = require('../util/handleError')
const { AppError } = require('../util/appError')
const { storage } = require('../util/firebase')

// Models
const models = require('../models/index')

// ===================================================================================

exports.getAllMovies = handleError(
  async (req, res, next) => {
    const movies = await models.movie.findAll({
      where: { status: 'active' },
      include: [
        {
          model: models.actor,
          attributes: { exclude: ['actor_movie_junction'] }
        }
      ]
    })

    let actor = models.actor

    // Promise[]
    const moviesPromises = movies.map(
      async ({
        id,
        title,
        description,
        imgurl,
        createdAt,
        updatedAt,
        actors
      }) => {
        const imgRef = ref(storage, imgurl)

        const imgDownloadUrl = await getDownloadURL(imgRef)

        return {
          id,
          title,
          description,
          imgurl: imgDownloadUrl,
          createdAt,
          updatedAt,
          actors
        }
      }
    )

    const resolvedMovies = await Promise.all(moviesPromises)

    res.status(200).json({
      status: 'success',
      data: { movies: resolvedMovies }
    })
  }
)

// ===================================================================================

exports.getMovieByID = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const movie = await models.movie.findOne({
      where: { status: 'active', id }
    })

    if (!movie) {
      return next(
        new AppError(404, 'Cannot find movie, invalid ID')
      )
    }

    res.status(200).json({
      status: 'success',
      data: { movie }
    })
  }
)

// ===================================================================================

exports.createMovie = handleError(
  async (req, res, next) => {
    const {
      title,
      description,
      duration,
      genre,
      rating,
      year,
      actors
    } = req.body

    // Upload img to firebase
    const fileExtension =
      req.file.originalname.split('.')[1]

    const imgRef = ref(
      storage,
      `imgs/movies/${title}-${Date.now()}.${fileExtension}`
    )

    const imgUploaded = await uploadBytes(
      imgRef,
      req.file.buffer
    )

    if (
      !title ||
      !description ||
      !duration ||
      !genre ||
      !rating ||
      !year ||
      !actors
    ) {
      return next(
        new AppError(
          404,
          'Need to provide a title, description, duration, genre, rating and year.'
        )
      )
    }

    const movie = await models.movie.create({
      title,
      description,
      duration,
      genre,
      imgurl: imgUploaded.metadata.fullPath,
      rating,
      year
    })

    console.log(actors)

    const actorsInMoviesPromises = actors.map(
      async (actorId) => {
        // Assign actors to newly created movie
        parseInt(actorId)
        console.log(actorId)

        return await models.actor_movie_junction.create({
          actorId,
          movieId: movie.id
        })
      }
    )

    await Promise.all(actorsInMoviesPromises)

    res.status(201).json({
      status: 'success',
      data: { movie }
    })
  }
)

// ===================================================================================

exports.updateMovie = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const data = filterObj(
      req.body,
      'title',
      'description',
      'duration',
      'genre',
      'rating',
      'year'
    )

    const movie = await models.movie.findOne({
      where: { id, status: 'active' }
    })

    if (!movie) {
      return next(400, 'Cannot update movie, invalid ID')
    }

    await movie.update({ ...data })

    res
      .status(200)
      .json({ status: 'success', data: { movie } })
  }
)

// ===================================================================================

exports.deleteMovie = handleError(
  async (req, res, next) => {
    const { id } = req.params

    if (!id) {
      res.status(404).json({
        status: 'error',
        message: 'Cannot delete movie, invalid ID'
      })
      return
    }

    const movie = await models.movie.findOne({
      where: { status: 'active', id }
    })

    await movie.update({ status: 'deleted' })

    res.status(200).json({
      status: 'success',
      message: 'deleted'
    })
  }
)
