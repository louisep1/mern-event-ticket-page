const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

connectDB()
const app = express()

// enable data to be send json/url encoded
app.use(express.json())

// routes and middleware
app.use('/api/event', require('./routes/eventRoutes'))
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/flyer', require('./routes/flyerRoutes'))

// Need to make the flyers folder static so it can get loaded in the browser (not static/not accessible by default)

// FOLDER:
const folder = path.resolve()
app.use('/flyers', express.static(path.join(folder, '/flyers')))

// app.use('/flyers', express.static(path.join(__dirname, '/flyers')))

// Serve frontend -
// static index.html file is entry point to frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // // FOLDER:
  // app.use(express.static(path.join(folder, '../frontend/build')))

  // route:
  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
      // // FOLDER:
      // path.resolve(folder, '../', 'frontend', 'build', 'index.html')
    )
  )
  // * is for anything except routes already created
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

// Error Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 500

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${PORT}`.cyan
      .underline
  )
)
