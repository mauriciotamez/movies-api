const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { promisify } = require('util')

//Models
const models = require('../models/index')

// Utils
const { AppError } = require('../util/appError')
const { handleError } = require('../util/handleError')

dotenv.config({ path: './.env' })

// ===================================================================================

exports.validateSession = handleError(async (req, res, next) => {
  // Extract token from headers

  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
    // return next(new AppError(400, 'Not a valid session'))
  }

  if (!token) {
    return next(new AppError(401, 'Invalid session.'))
  }

  // Verify that token is still valid
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  )

  if (!decodedToken) {
    return next(new AppError(401, 'Invalid session'))
  }

  // Validate that the id that the token contains belongs to a valid user
  const user = await models.user.findOne({
    where: {
      id: decodedToken.id,
      status: 'active'
    },
    attributes: { exclude: ['password'] }
  })

  if (!user) {
    return next(new AppError(401, 'This user is no longer available.'))
  }

  req.currentUser = user

  // Grant access
  next()
})

// ===================================================================================

exports.isAdmin = (roles) => {
  return handleError(async (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(new AppError(403, 'Access denied'))
    }
    next()
  })
}

// ===================================================================================

exports.protectAccountOwner = handleError(async (req, res, next) => {
  const { id } = req.params
  const { currentUser } = req

  if (currentUser.id !== +id) {
    return next(new AppError(403, `You can't update other users accounts`))
  }

  next()
})
