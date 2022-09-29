const express = require('express')

const router = express.Router()

// Utils

const { upload } = require('../util/multer')
const { isAdmin, validateSession } = require('../middlewares/auth.middleware')

// Controllers

const {
  getAllActors,
  getActorByID,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller')

// ===================================================================================

router.use(validateSession)

// ===================================================================================

router.get('/', getAllActors)

// ===================================================================================

router.get('/:id', getActorByID)

// ===================================================================================

router.post('/', isAdmin(['admin']), upload.single('img'), createActor)

// ===================================================================================

router.patch('/:id', isAdmin(['admin']), updateActor)

// ===================================================================================

router.delete('/:id', isAdmin(['admin']), deleteActor)

module.exports = { actorsRouter: router }
