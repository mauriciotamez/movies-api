// Utils
const { filterObj } = require('../util/filterObj')
const { handleError } = require('../util/handleError')
const { AppError } = require('../util/appError')

// Models
const models = require('../models/index')

exports.getAllActors = handleError(
  async (req, res, next) => {
    const actors = await models.actor.findAll({
      where: { status: 'active' }
    })

    res.status(200).json({
      status: 'success',
      data: { actors }
    })
  }
)

exports.getActorByID = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const actor = await Actor.findOne({
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

exports.createActor = handleError(
  async (req, res, next) => {
    const { name, country, age, profile_pic, rating } =
      req.body

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
      profile_pic,
      rating
    })

    res.status(201).json({
      status: 'success',
      data: { actor }
    })
  }
)

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

exports.deleteActor = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const actor = await Actor.findOne({
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
      status: 'success'
    })
  }
)
