const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Utils
const { filterObj } = require('../util/filterObj')
const { handleError } = require('../util/handleError')
const { AppError } = require('../util/appError')

const models = require('../models/index')

exports.getAllUsers = handleError(
  async (req, res, next) => {
    try {
      const users = await models.user.findAll({
        where: { status: 'active' },
        attributes: {
          exclude: ['password']
        }
      })

      res.status(200).json({
        status: 'success',
        data: { users }
      })
    } catch (e) {
      console.log(e)
    }
  }
)

exports.getUserByID = handleError(
  async (req, res, next) => {
    const { id } = req.params

    const user = await models.user.findOne({
      where: { status: 'active', id },
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return next(
        new AppError(400, 'Cannot find a user, invalid ID')
      )
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    })
  }
)

exports.createUser = handleError(async (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return next(
      new AppError(
        404,
        'Must provide a name, email and password'
      )
    )
  }

  const salt = await bcrypt.genSalt(12)

  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await models.user.create({
    username,
    email,
    password: hashedPassword
  })

  newUser.password = undefined

  res.status(201).json({
    status: 'success',
    data: { newUser }
  })
})

exports.updateUser = handleError(
  async (req, res, next) => {}
)

exports.deleteUser = handleError(
  async (req, res, next) => {}
)

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(
      new AppError(400, 'Please provide user and email.')
    )
  }
  // Find user given an email and a status 'active'
  const user = await models.user.findOne({
    where: { email, status: 'active' }
  })

  // Compare req.body password (User password) vs hashed user password
  if (
    !user ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return next(new AppError(400, 'Credentials invalid'))
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  )

  res.status(200).json({
    status: 'success',
    data: { token }
  })
}
