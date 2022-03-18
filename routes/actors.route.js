const express = require('express');

const router = express.Router();

const {
  getAllActors,
  getActorByID,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

router.get('/', getAllActors);

router.get('/:id', getActorByID);

router.post('/', createActor);

router.patch('/:id', updateActor);

router.delete('/:id', deleteActor);

module.exports = { actorsRouter: router };
