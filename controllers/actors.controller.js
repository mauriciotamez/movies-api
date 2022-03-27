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

exports.getAllActors = handleError(
  async (req, res, next) => {
    const actors = await models.actor.findAll({
      where: { status: 'active' },
      include: [{ model: models.movie }]
    })

    let movie = models.movie

    // Iterate over the movies, and for each movie get the url from firebase
    // and use getDownloadUrl that firebase provide us to make it an accesible URL
    const actorsPromises = actors.map(
      async ({
        id,
        name,
        country,
        age,
        rating,
        profile_pic,
        createdAt,
        updatedAt,
        movies
      }) => {
        const imgRef = ref(storage, profile_pic)

        const imgDownloadUrl = await getDownloadURL(imgRef)

        return {
          id,
          name,
          country,
          age,
          rating,
          profile_pic: imgDownloadUrl,
          createdAt,
          updatedAt,
          movies
        }
      }
    )

    const resolvedActors = await Promise.all(actorsPromises)

    res.status(200).json({
      status: 'success',
      data: { actors: resolvedActors }
    })
  }
)

// ===================================================================================

exports.getActorByID = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const actor = await models.actor.findOne({
      where: { status: 'active', id }
    })

    if (!actor) {
      return next(
        new AppError(
          400,
          'Cannot find an actor, invalid ID'
        )
      )
    }
    res.status(200).json({
      status: 'success',
      data: { actor }
    })
  }
)

// ===================================================================================

exports.createActor = handleError(
  async (req, res, next) => {
    const { name, country, age, profile_pic, rating } =
      req.body

    // Upload img to firebase
    const fileExtension =
      req.file.originalname.split('.')[1]

    const imgRef = ref(
      storage,
      `imgs/actors/${name}-${Date.now()}.${fileExtension}`
    )

    const imgUploaded = await uploadBytes(
      imgRef,
      req.file.buffer
    )
    if (!name || !country || !age || !rating) {
      return next(
        new AppError(
          400,
          'Must provide a name, country age and profile pic.'
        )
      )
    }

    const actor = await models.actor.create({
      name,
      country,
      age,
      profile_pic: imgUploaded.metadata.fullPath,
      rating
    })

    res.status(201).json({
      status: 'success',
      data: { actor }
    })
  }
)

// ===================================================================================

exports.updateActor = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const data = filterObj(
      req.body,
      'name',
      'country',
      'age',
      'rating',
      'profile_pic'
    )

    const actor = await models.actor.findOne({
      where: { id, status: 'active' }
    })

    if (!actor) {
      return next(
        new AppError(
          400,
          'Cannot update actor, invalid ID.'
        )
      )
    }

    await actor.update({ ...data })

    res
      .status(200)
      .json({ status: 'success', data: { actor } })
  }
)

// ===================================================================================

exports.deleteActor = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const actor = await models.actor.findOne({
      where: { id, status: 'active' }
    })

    if (!actor) {
      return next(
        new AppError(
          400,
          'Cannot delete actor, invalid ID.'
        )
      )
    }

    await actor.update({ status: 'deleted' })

    res.status(200).json({
      status: 'success',
      message: 'deleted'
    })
  }
)
