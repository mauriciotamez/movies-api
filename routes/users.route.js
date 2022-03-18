const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

router.get('/', getAllUsers);

router.get('/:id', getUserByID);

router.post('/', createUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = { usersRouter: router };
