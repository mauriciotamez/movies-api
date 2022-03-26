const express = require('express')

// Utils
const {
	globalErrorHandler
} = require('./controllers/error.controller')
// Routes
const { moviesRouter } = require('./routes/movies.router')
const { usersRouter } = require('./routes/users.route')
const { actorsRouter } = require('./routes/actors.route')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Endpoints
app.use('/api/v1/movies', moviesRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/actors', actorsRouter)

app.use(globalErrorHandler)

module.exports = { app }
