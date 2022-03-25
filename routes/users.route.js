const express = require('express')

const router = express.Router()

// Middlewares
const {
  validateSession,
  isAdmin
} = require('../middlewares/auth.middleware')

// Controllers
const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updateUserRole
} = require('../controllers/users.controller')

router.post('/login', loginUser)

router.post('/', createUser)

router.use(validateSession)

router.get('/', isAdmin(['admin']), getAllUsers)

router.get('/:id', isAdmin(['admin']), getUserByID)

router.patch('/:id', updateUser)

router.patch(
  '/admin/:id',
  isAdmin(['admin']),
  updateUserRole
)

router.delete('/:id', isAdmin(['admin']), deleteUser)

module.exports = { usersRouter: router }
