// Utils
const { filterObj } = require('../util/filterObj');
const { handleError } = require('../util/handleError');
const { AppError } = require('../util/appError');

// Models
const { Actor } = require('../models/actor.model');

exports.getAllActors = handleError(
  async (req, res, next) => {
    const actors = await Actor.findAll({
      where: { status: 'active' }
    });

    res.status(200).json({
      status: 'success',
      data: { actors }
    });
  }
);

exports.getActorByID = handleError(
  async (req, res, next) => {
    const { id } = req.params;

    const actor = await Actor.findOne({
      where: { status: 'active', id }
    });

    if (!actor) {
      return next(
        new AppError(
          400,
          'Cannot find an actor, invalid ID'
        )
      );
    }
    res.status(200).json({
      status: 'success',
      data: { actor }
    });
  }
);

exports.createActor = handleError(
  async (req, res, next) => {
    const { name, country, age, profilePic } = req.body;

    if (!name || !country || !age) {
      return next(
        new AppError(
          400,
          'Must provide a name, country age and profile pic.'
        )
      );
    }

    const actor = await Actor.create({
      name,
      country,
      age,
      profilePic
    });

    res.status(201).json({
      status: 'success',
      data: { actor }
    });
  }
);

exports.updateActor = handleError(
  async (req, res, next) => {
    const { id } = req.params;

    const data = filterObj(
      req.body,
      'name',
      'country',
      'age'
    );

    const actor = await Actor.findOne({
      where: { id, status: 'active' }
    });

    if (!actor) {
      return next(
        new AppError(
          400,
          'Cannot update actor, invalid ID.'
        )
      );
    }

    await actor.update({ ...data });

    res
      .status(204)
      .json({ status: 'success', data: { actor } });
  }
);

exports.deleteActor = handleError(
  async (req, res, next) => {
    const { id } = req.params;

    const actor = await Actor.findOne({
      where: { id, status: 'active' }
    });

    if (!actor) {
      return next(
        new AppError(
          400,
          'Cannot delete actor, invalid ID.'
        )
      );
    }

    await actor.update({ status: 'deleted' });

    res.status(204).json({
      status: 'success'
    });
  }
);
